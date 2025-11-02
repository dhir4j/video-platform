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


def generate_meta_title(title: str, max_length: int = 60, add_suffix: bool = True, site_name: str = "") -> str:
    """
    Generate SEO-optimized meta title for search ranking.
    Creates compelling titles that attract clicks in search results.

    Args:
        title: Original title
        max_length: Maximum character length (default 60)
        add_suffix: Whether to add site name suffix
        site_name: Site name to add as suffix

    Returns:
        Optimized meta title designed for search ranking
    """
    # Add year for freshness signal (helps with ranking)
    from datetime import datetime
    current_year = datetime.now().year

    # If title doesn't have year and is a tutorial/guide, add it
    if str(current_year) not in title and any(word in title.lower() for word in ['tutorial', 'guide', 'how to', 'learn']):
        title = f"{title} ({current_year})"

    # Add site name if specified and space allows
    if add_suffix and site_name and len(title) + len(site_name) + 3 <= max_length:
        title = f"{title} | {site_name}"

    if len(title) <= max_length:
        return title

    # Truncate at word boundary
    truncated = title[:max_length].rsplit(' ', 1)[0]
    return f"{truncated}..."


def generate_meta_description(body: str, title: str = "", max_length: int = 160, add_cta: bool = True) -> str:
    """
    Generate SEO-optimized meta description that attracts clicks.
    Includes compelling language and call-to-action.

    Args:
        body: Content body text
        title: Post title (for context)
        max_length: Maximum character length (default 160)
        add_cta: Whether to add call-to-action

    Returns:
        Optimized meta description designed for click-through
    """
    # Clean up extra whitespace
    cleaned = ' '.join(body.split())

    # Add compelling CTA phrases for better CTR
    cta_phrases = [
        "Watch now to learn",
        "Discover how to",
        "Learn the best way to",
        "Find out how",
        "See step-by-step"
    ]

    # If body is too short, enhance it
    if len(cleaned) < 100 and add_cta:
        # Try to make it more compelling
        for phrase in cta_phrases:
            if any(word in title.lower() for word in ['tutorial', 'guide', 'how to']):
                enhanced = f"{phrase} {cleaned.lower()}"
                if len(enhanced) <= max_length:
                    cleaned = enhanced
                    break

    if len(cleaned) <= max_length:
        return cleaned

    # Truncate at word boundary, but try to end with complete sentence
    truncated = cleaned[:max_length].rsplit(' ', 1)[0]

    # Try to end at sentence boundary
    last_period = truncated.rfind('.')
    if last_period > max_length * 0.7:  # If period is in last 30%
        return truncated[:last_period + 1]

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


def generate_article_structured_data(
    title: str,
    description: str,
    author_name: str,
    site_name: str,
    site_url: str,
    slug: str,
    thumbnail_url: str,
    publish_date: datetime,
    modified_date: datetime,
    categories: List[str],
    tags: List[str]
) -> Dict:
    """
    Generate Article schema for better search ranking.
    Article schema helps Google understand content type and show rich results.

    Args:
        title: Article title
        description: Article description
        author_name: Author/site name
        site_name: Site name
        site_url: Base site URL
        slug: Article slug
        thumbnail_url: Featured image URL
        publish_date: Publication date
        modified_date: Last modified date
        categories: List of categories
        tags: List of tags

    Returns:
        Dictionary containing Article structured data
    """
    article_url = f"{site_url}/watch/{slug}"

    return {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "image": thumbnail_url,
        "author": {
            "@type": "Organization",
            "name": author_name or site_name
        },
        "publisher": {
            "@type": "Organization",
            "name": site_name,
            "logo": {
                "@type": "ImageObject",
                "url": f"{site_url}/logo.png"
            }
        },
        "datePublished": publish_date.isoformat(),
        "dateModified": modified_date.isoformat(),
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": article_url
        },
        "articleSection": categories[0] if categories else "Videos",
        "keywords": ", ".join(tags[:10])
    }


def generate_long_tail_keywords(title: str, tags: List[str], categories: List[str]) -> List[str]:
    """
    Generate long-tail keywords for better search ranking.
    Long-tail keywords help pages rank for specific searches.

    Args:
        title: Post title
        tags: List of tags
        categories: List of categories

    Returns:
        List of long-tail keyword phrases
    """
    long_tail = []

    # Extract main topic words from title
    common_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'}
    title_words = [word.lower() for word in title.split() if word.lower() not in common_words and len(word) > 3]

    # Question-based long-tail keywords (how people search)
    question_starters = [
        'how to',
        'what is',
        'why',
        'when to',
        'where to',
        'best way to',
        'guide to',
        'tutorial for',
        'learn'
    ]

    # Create combinations
    for tag in tags[:5]:
        tag_lower = tag.lower()

        # Add tag variations
        long_tail.append(tag_lower)
        long_tail.append(f"{tag_lower} tutorial")
        long_tail.append(f"{tag_lower} guide")
        long_tail.append(f"learn {tag_lower}")

        # Combine with question words
        for question in question_starters[:3]:
            long_tail.append(f"{question} {tag_lower}")

    # Category-based keywords
    for category in categories:
        cat_lower = category.lower()
        long_tail.append(f"{cat_lower} videos")
        long_tail.append(f"best {cat_lower}")

    # Year for freshness
    from datetime import datetime
    current_year = datetime.now().year
    long_tail.append(f"{tags[0] if tags else title_words[0]} {current_year}")

    # Deduplicate and limit
    unique_keywords = list(dict.fromkeys(long_tail))
    return unique_keywords[:20]


def generate_faq_structured_data(questions_answers: List[Dict[str, str]]) -> Dict:
    """
    Generate FAQ schema for search result enhancement.
    FAQ schema can appear in Google search results as expandable FAQ.

    Args:
        questions_answers: List of dicts with 'question' and 'answer' keys

    Returns:
        Dictionary containing FAQ structured data
    """
    if not questions_answers:
        return {}

    faq_items = []
    for qa in questions_answers:
        faq_items.append({
            "@type": "Question",
            "name": qa['question'],
            "acceptedAnswer": {
                "@type": "Answer",
                "text": qa['answer']
            }
        })

    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faq_items
    }


def generate_how_to_structured_data(
    name: str,
    description: str,
    steps: List[Dict[str, str]],
    video_url: str,
    duration_seconds: float
) -> Dict:
    """
    Generate HowTo schema for tutorial/guide content.
    HowTo schema can show up as rich results with steps in search.

    Args:
        name: Tutorial/guide name
        description: Description
        steps: List of dicts with 'name' and 'text' keys
        video_url: Video URL
        duration_seconds: Video duration

    Returns:
        Dictionary containing HowTo structured data
    """
    # Convert duration to ISO 8601
    minutes = int(duration_seconds // 60)
    seconds = int(duration_seconds % 60)
    duration_iso = f"PT{minutes}M{seconds}S"

    step_items = []
    for idx, step in enumerate(steps, 1):
        step_items.append({
            "@type": "HowToStep",
            "position": idx,
            "name": step.get('name', f"Step {idx}"),
            "text": step.get('text', '')
        })

    return {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": name,
        "description": description,
        "video": {
            "@type": "VideoObject",
            "name": name,
            "description": description,
            "contentUrl": video_url,
            "duration": duration_iso
        },
        "step": step_items
    }


def generate_seo_friendly_title_variations(title: str, category: str = "") -> List[str]:
    """
    Generate title variations optimized for different search queries.
    Helps pages rank for multiple search terms.

    Args:
        title: Original title
        category: Category name

    Returns:
        List of title variations
    """
    from datetime import datetime
    current_year = datetime.now().year

    variations = [title]

    # Add year
    if str(current_year) not in title:
        variations.append(f"{title} ({current_year})")
        variations.append(f"{title} - {current_year} Guide")

    # Add category prefix
    if category:
        variations.append(f"{category}: {title}")
        variations.append(f"Best {category} - {title}")

    # Add compelling prefixes
    prefixes = [
        "Complete Guide:",
        "Learn:",
        "Master:",
        "Ultimate Guide to",
        "Step-by-Step:"
    ]

    for prefix in prefixes[:2]:
        variations.append(f"{prefix} {title}")

    return variations


def generate_canonical_url(site_url: str, slug: str) -> str:
    """
    Generate canonical URL for the post.
    Prevents duplicate content issues.

    Args:
        site_url: Base site URL
        slug: Post slug

    Returns:
        Canonical URL
    """
    # Ensure site_url doesn't end with slash and slug doesn't start with slash
    site_url = site_url.rstrip('/')
    slug = slug.lstrip('/')

    return f"{site_url}/watch/{slug}"


def extract_focus_keyword(title: str, tags: List[str]) -> str:
    """
    Extract the primary focus keyword for SEO.
    Focus keyword is what the page should rank for.

    Args:
        title: Post title
        tags: List of tags

    Returns:
        Focus keyword phrase
    """
    # Use first tag as focus if available
    if tags:
        return tags[0].lower()

    # Otherwise extract from title
    # Remove common words
    stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'how', 'to'}
    words = [w.lower() for w in title.split() if w.lower() not in stop_words and len(w) > 3]

    # Return first 2-3 important words as focus keyword
    return ' '.join(words[:3]) if words else title.lower()
