"""
SEO Utilities for generating optimized meta tags and structured data.
Implements best practices for search engine optimization.
"""
import json
from datetime import datetime
from urllib.parse import urlparse
from typing import Dict, List, Optional
import re


def slugify(text: str) -> str:
    """
    Convert text to URL-friendly slug.

    Args:
        text: Input text to slugify

    Returns:
        URL-safe slug string
    """
    # Convert to lowercase
    text = text.lower()
    # Replace spaces and special characters with hyphens
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    text = re.sub(r'^-+|-+$', '', text)
    return text


def extract_slug_from_url(url: str) -> str:
    """
    Extract slug from URL path.

    Args:
        url: Full URL string

    Returns:
        Extracted slug or generated slug from URL
    """
    parsed = urlparse(url)
    path = parsed.path.strip('/')

    # Get the last segment of the path
    segments = path.split('/')
    if segments:
        return segments[-1]
    return slugify(url)


def generate_meta_title(title: str, max_length: int = 60) -> str:
    """
    Generate SEO-optimized meta title.
    Keeps title within recommended character limit.

    Args:
        title: Original title
        max_length: Maximum character length (default 60)

    Returns:
        Optimized meta title
    """
    if len(title) <= max_length:
        return title

    # Truncate at word boundary
    truncated = title[:max_length].rsplit(' ', 1)[0]
    return f"{truncated}..."


def generate_meta_description(body: str, max_length: int = 160) -> str:
    """
    Generate SEO-optimized meta description from body text.

    Args:
        body: Content body text
        max_length: Maximum character length (default 160)

    Returns:
        Optimized meta description
    """
    # Clean up extra whitespace
    cleaned = ' '.join(body.split())

    if len(cleaned) <= max_length:
        return cleaned

    # Truncate at word boundary
    truncated = cleaned[:max_length].rsplit(' ', 1)[0]
    return f"{truncated}..."


def generate_meta_keywords(tags: List[str], categories: List[str], max_keywords: int = 10) -> str:
    """
    Generate meta keywords from tags and categories.

    Args:
        tags: List of tags
        categories: List of categories
        max_keywords: Maximum number of keywords

    Returns:
        Comma-separated keywords string
    """
    # Combine and deduplicate
    all_keywords = list(dict.fromkeys(categories + tags))
    # Limit to max keywords
    keywords = all_keywords[:max_keywords]
    return ', '.join(keywords)


def generate_video_structured_data(
    title: str,
    description: str,
    video_url: str,
    thumbnail_url: str,
    upload_date: datetime,
    duration_seconds: float,
    categories: List[str],
    tags: List[str],
    site_url: str,
    slug: str
) -> Dict:
    """
    Generate JSON-LD structured data for VideoObject schema.
    Follows Schema.org VideoObject specification for enhanced search results.

    Args:
        title: Video title
        description: Video description
        video_url: Direct video file URL
        thumbnail_url: Thumbnail image URL
        upload_date: Upload/publish date
        duration_seconds: Video duration in seconds
        categories: List of categories
        tags: List of tags
        site_url: Base site URL
        slug: Post slug

    Returns:
        Dictionary containing JSON-LD structured data
    """
    # Convert duration to ISO 8601 format (PT#M#S)
    minutes = int(duration_seconds // 60)
    seconds = int(duration_seconds % 60)
    duration_iso = f"PT{minutes}M{seconds}S"

    structured_data = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": title,
        "description": description,
        "thumbnailUrl": thumbnail_url,
        "uploadDate": upload_date.isoformat(),
        "duration": duration_iso,
        "contentUrl": video_url,
        "embedUrl": f"{site_url}/watch/{slug}",
        "keywords": ', '.join(tags[:10]),  # Limit keywords
    }

    # Add genre/category if available
    if categories:
        structured_data["genre"] = categories

    # Add potential action for engagement
    structured_data["potentialAction"] = {
        "@type": "WatchAction",
        "target": f"{site_url}/watch/{slug}"
    }

    return structured_data


def generate_breadcrumb_structured_data(
    site_url: str,
    site_name: str,
    category: Optional[str] = None,
    title: Optional[str] = None
) -> Dict:
    """
    Generate JSON-LD structured data for BreadcrumbList.
    Helps search engines understand site hierarchy.

    Args:
        site_url: Base site URL
        site_name: Site name
        category: Category name (optional)
        title: Page title (optional)

    Returns:
        Dictionary containing breadcrumb structured data
    """
    items = [
        {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": site_url
        }
    ]

    position = 2
    if category:
        items.append({
            "@type": "ListItem",
            "position": position,
            "name": category,
            "item": f"{site_url}/categories/{slugify(category)}"
        })
        position += 1

    if title:
        items.append({
            "@type": "ListItem",
            "position": position,
            "name": title
        })

    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items
    }


def generate_complete_structured_data(
    post_data: Dict,
    site_url: str,
    site_name: str
) -> str:
    """
    Generate complete structured data combining VideoObject and BreadcrumbList.

    Args:
        post_data: Dictionary containing post information
        site_url: Base site URL
        site_name: Site name

    Returns:
        JSON string containing structured data array
    """
    structured_data_list = []

    # Video structured data
    video_data = generate_video_structured_data(
        title=post_data['title'],
        description=post_data['body'],
        video_url=post_data['video_url'],
        thumbnail_url=post_data['thumbnail'],
        upload_date=post_data.get('created_at', datetime.utcnow()),
        duration_seconds=post_data.get('video_duration_seconds', 0),
        categories=post_data.get('categories', []),
        tags=post_data.get('tags', []),
        site_url=site_url,
        slug=post_data['slug']
    )
    structured_data_list.append(video_data)

    # Breadcrumb structured data
    category = post_data.get('categories', [None])[0] if post_data.get('categories') else None
    breadcrumb_data = generate_breadcrumb_structured_data(
        site_url=site_url,
        site_name=site_name,
        category=category,
        title=post_data['title']
    )
    structured_data_list.append(breadcrumb_data)

    return json.dumps(structured_data_list, indent=2)


def validate_required_fields(article: Dict) -> tuple[bool, Optional[str]]:
    """
    Validate that article has all required fields for SEO optimization.

    Args:
        article: Article dictionary to validate

    Returns:
        Tuple of (is_valid, error_message)
    """
    required_fields = ['url', 'title', 'body', 'video']

    for field in required_fields:
        if field not in article or not article[field]:
            return False, f"Missing required field: {field}"

    return True, None
