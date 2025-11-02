"""
Simple test script to verify the Flask server setup.
Run this after installing dependencies to check if everything works.
"""
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))


def test_imports():
    """Test that all required modules can be imported"""
    print("Testing imports...")
    try:
        import flask
        print("  ✓ Flask imported successfully")

        from flask_sqlalchemy import SQLAlchemy
        print("  ✓ Flask-SQLAlchemy imported successfully")

        from flask_cors import CORS
        print("  ✓ Flask-CORS imported successfully")

        import config
        print("  ✓ Config module imported successfully")

        from models import db, Post, ProcessingLog
        print("  ✓ Models imported successfully")

        from services.post_processor import PostProcessor
        print("  ✓ PostProcessor imported successfully")

        from utils.seo_utils import (
            slugify,
            generate_meta_title,
            generate_meta_description
        )
        print("  ✓ SEO utilities imported successfully")

        return True
    except ImportError as e:
        print(f"  ✗ Import error: {str(e)}")
        return False


def test_seo_utils():
    """Test SEO utility functions"""
    print("\nTesting SEO utilities...")
    try:
        from utils.seo_utils import (
            slugify,
            generate_meta_title,
            generate_meta_description,
            generate_meta_keywords
        )

        # Test slugify
        slug = slugify("This is a Test Title!")
        assert slug == "this-is-a-test-title", f"Slugify failed: got {slug}"
        print("  ✓ slugify() works correctly")

        # Test meta title
        long_title = "A" * 100
        meta_title = generate_meta_title(long_title, max_length=60)
        assert len(meta_title) <= 63, f"Meta title too long: {len(meta_title)}"
        print("  ✓ generate_meta_title() works correctly")

        # Test meta description
        long_body = "Lorem ipsum " * 50
        meta_desc = generate_meta_description(long_body, max_length=160)
        assert len(meta_desc) <= 163, f"Meta description too long: {len(meta_desc)}"
        print("  ✓ generate_meta_description() works correctly")

        # Test meta keywords
        tags = ["tag1", "tag2", "tag3"]
        categories = ["cat1", "cat2"]
        keywords = generate_meta_keywords(tags, categories)
        assert isinstance(keywords, str), "Keywords should be a string"
        assert "tag1" in keywords and "cat1" in keywords
        print("  ✓ generate_meta_keywords() works correctly")

        return True
    except Exception as e:
        print(f"  ✗ SEO utilities test failed: {str(e)}")
        return False


def test_app_creation():
    """Test Flask app creation"""
    print("\nTesting Flask app creation...")
    try:
        from app import create_app

        app = create_app()
        assert app is not None, "App creation failed"
        print("  ✓ Flask app created successfully")

        # Check if routes are registered
        rules = [str(rule) for rule in app.url_map.iter_rules()]
        required_endpoints = ['/api/health', '/api/stats', '/api/process', '/api/posts']

        for endpoint in required_endpoints:
            if endpoint in rules or any(endpoint in rule for rule in rules):
                print(f"  ✓ Endpoint {endpoint} registered")
            else:
                print(f"  ✗ Endpoint {endpoint} not found")

        return True
    except Exception as e:
        print(f"  ✗ App creation test failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def test_database():
    """Test database initialization"""
    print("\nTesting database initialization...")
    try:
        from app import create_app
        from models import db, Post

        app = create_app()
        with app.app_context():
            # Create tables
            db.create_all()
            print("  ✓ Database tables created successfully")

            # Test creating a post
            test_post = Post(
                page_number=1,
                article_number=1,
                original_url="https://test.com/test-video",
                slug="test-video",
                title="Test Video",
                body="This is a test video description",
                video_url="https://test.com/video.mp4",
                is_published=True
            )

            db.session.add(test_post)
            db.session.commit()
            print("  ✓ Test post created successfully")

            # Query the post
            retrieved = Post.query.filter_by(slug="test-video").first()
            assert retrieved is not None, "Failed to retrieve test post"
            assert retrieved.title == "Test Video"
            print("  ✓ Test post retrieved successfully")

            # Clean up
            db.session.delete(retrieved)
            db.session.commit()
            print("  ✓ Test post deleted successfully")

        return True
    except Exception as e:
        print(f"  ✗ Database test failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def test_config():
    """Test configuration"""
    print("\nTesting configuration...")
    try:
        import config

        assert hasattr(config, 'DATABASE_URI'), "DATABASE_URI not found"
        print(f"  ✓ Database URI: {config.DATABASE_URI}")

        assert hasattr(config, 'FLASK_PORT'), "FLASK_PORT not found"
        print(f"  ✓ Flask port: {config.FLASK_PORT}")

        assert hasattr(config, 'SITE_URL'), "SITE_URL not found"
        print(f"  ✓ Site URL: {config.SITE_URL}")

        assert hasattr(config, 'BATCH_SIZE'), "BATCH_SIZE not found"
        print(f"  ✓ Batch size: {config.BATCH_SIZE}")

        return True
    except Exception as e:
        print(f"  ✗ Configuration test failed: {str(e)}")
        return False


def main():
    """Run all tests"""
    print("=" * 60)
    print("Flask Backend Server - Installation Test")
    print("=" * 60)

    tests = [
        ("Imports", test_imports),
        ("Configuration", test_config),
        ("SEO Utilities", test_seo_utils),
        ("App Creation", test_app_creation),
        ("Database", test_database),
    ]

    results = []
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"\n✗ {test_name} test failed with exception: {str(e)}")
            results.append((test_name, False))

    print("\n" + "=" * 60)
    print("Test Results")
    print("=" * 60)

    all_passed = True
    for test_name, result in results:
        status = "✓ PASSED" if result else "✗ FAILED"
        print(f"{test_name}: {status}")
        if not result:
            all_passed = False

    print("=" * 60)

    if all_passed:
        print("\n✓ All tests passed! The server is ready to use.")
        print("\nNext steps:")
        print("  1. Run the server: python app.py")
        print("  2. Check health: curl http://localhost:5000/api/health")
        print("  3. Process data: curl -X POST http://localhost:5000/api/process")
        return 0
    else:
        print("\n✗ Some tests failed. Please check the errors above.")
        print("Make sure all dependencies are installed: pip install -r requirements.txt")
        return 1


if __name__ == '__main__':
    exit(main())
