"""
Sitemap Generator
Generates XML sitemaps for search engines (Google, Bing, etc.)
Helps search engines discover and index all your pages.
"""
from datetime import datetime
from typing import List, Dict
from xml.etree.ElementTree import Element, SubElement, tostring
from xml.dom import minidom


def generate_sitemap_xml(posts: List[Dict], site_url: str) -> str:
    """
    Generate XML sitemap for search engines.
    Helps Google/Bing discover and index all your video pages.

    Args:
        posts: List of post dictionaries
        site_url: Base site URL

    Returns:
        XML sitemap as string
    """
    # Create root element
    urlset = Element('urlset')
    urlset.set('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    urlset.set('xmlns:video', 'http://www.google.com/schemas/sitemap-video/1.1')
    urlset.set('xmlns:image', 'http://www.google.com/schemas/sitemap-image/1.1')

    # Add homepage
    url_elem = SubElement(urlset, 'url')
    SubElement(url_elem, 'loc').text = site_url.rstrip('/')
    SubElement(url_elem, 'changefreq').text = 'daily'
    SubElement(url_elem, 'priority').text = '1.0'
    SubElement(url_elem, 'lastmod').text = datetime.utcnow().strftime('%Y-%m-%d')

    # Add each post
    for post in posts:
        if not post.get('is_published', True):
            continue  # Skip unpublished posts

        url_elem = SubElement(urlset, 'url')

        # Page URL
        page_url = f"{site_url.rstrip('/')}/watch/{post['slug']}"
        SubElement(url_elem, 'loc').text = page_url

        # Last modified date
        updated_at = post.get('updated_at') or post.get('created_at')
        if updated_at:
            # Handle ISO format dates
            if isinstance(updated_at, str):
                try:
                    date_obj = datetime.fromisoformat(updated_at.replace('Z', '+00:00'))
                    lastmod = date_obj.strftime('%Y-%m-%d')
                except:
                    lastmod = datetime.utcnow().strftime('%Y-%m-%d')
            else:
                lastmod = updated_at.strftime('%Y-%m-%d')
            SubElement(url_elem, 'lastmod').text = lastmod

        # Change frequency
        SubElement(url_elem, 'changefreq').text = 'weekly'

        # Priority (0.0 to 1.0)
        SubElement(url_elem, 'priority').text = '0.8'

        # Video data (Google video sitemap extension)
        if post.get('video_url'):
            video_elem = SubElement(url_elem, 'video:video')
            SubElement(video_elem, 'video:thumbnail_loc').text = post.get('thumbnail', '')
            SubElement(video_elem, 'video:title').text = post.get('title', '')
            SubElement(video_elem, 'video:description').text = post.get('body', '')[:2048]  # Max 2048 chars
            SubElement(video_elem, 'video:content_loc').text = post['video_url']

            # Duration (in seconds)
            if post.get('video_duration_seconds'):
                SubElement(video_elem, 'video:duration').text = str(int(post['video_duration_seconds']))

            # Publication date
            if post.get('created_at'):
                pub_date = post['created_at']
                if isinstance(pub_date, str):
                    SubElement(video_elem, 'video:publication_date').text = pub_date
                else:
                    SubElement(video_elem, 'video:publication_date').text = pub_date.isoformat()

            # Family friendly (assume yes)
            SubElement(video_elem, 'video:family_friendly').text = 'yes'

            # Tags
            if post.get('tags'):
                tags = post['tags'][:32]  # Max 32 tags
                SubElement(video_elem, 'video:tag').text = ', '.join(tags)

            # Category
            if post.get('categories') and len(post['categories']) > 0:
                SubElement(video_elem, 'video:category').text = post['categories'][0]

        # Image data (thumbnail)
        if post.get('thumbnail'):
            image_elem = SubElement(url_elem, 'image:image')
            SubElement(image_elem, 'image:loc').text = post['thumbnail']
            SubElement(image_elem, 'image:title').text = post.get('title', '')

    # Pretty print XML
    xml_str = tostring(urlset, encoding='utf-8')
    dom = minidom.parseString(xml_str)
    pretty_xml = dom.toprettyxml(indent='  ', encoding='utf-8').decode('utf-8')

    # Remove extra whitespace lines
    lines = [line for line in pretty_xml.split('\n') if line.strip()]
    return '\n'.join(lines)


def generate_sitemap_index(sitemaps: List[Dict[str, str]], site_url: str) -> str:
    """
    Generate sitemap index file (for sites with multiple sitemaps).
    Use if you have > 50,000 URLs or sitemap > 50MB.

    Args:
        sitemaps: List of dicts with 'loc' and 'lastmod' keys
        site_url: Base site URL

    Returns:
        XML sitemap index as string
    """
    sitemapindex = Element('sitemapindex')
    sitemapindex.set('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')

    for sitemap in sitemaps:
        sitemap_elem = SubElement(sitemapindex, 'sitemap')
        SubElement(sitemap_elem, 'loc').text = f"{site_url.rstrip('/')}{sitemap['loc']}"
        SubElement(sitemap_elem, 'lastmod').text = sitemap.get('lastmod', datetime.utcnow().strftime('%Y-%m-%d'))

    # Pretty print
    xml_str = tostring(sitemapindex, encoding='utf-8')
    dom = minidom.parseString(xml_str)
    pretty_xml = dom.toprettyxml(indent='  ', encoding='utf-8').decode('utf-8')

    lines = [line for line in pretty_xml.split('\n') if line.strip()]
    return '\n'.join(lines)


def generate_robots_txt(site_url: str, sitemap_url: str = None, allow_all: bool = True) -> str:
    """
    Generate robots.txt file for search engine crawlers.
    Tells search engines which pages to crawl and where sitemap is.

    Args:
        site_url: Base site URL
        sitemap_url: Full sitemap URL (optional, auto-generated if not provided)
        allow_all: Whether to allow all bots (default True)

    Returns:
        robots.txt content as string
    """
    if not sitemap_url:
        sitemap_url = f"{site_url.rstrip('/')}/sitemap.xml"

    robots_lines = [
        "# robots.txt for search engine optimization",
        "# Generated automatically",
        "",
        "User-agent: *"
    ]

    if allow_all:
        robots_lines.extend([
            "Allow: /",
            "",
            "# Crawl-delay to be nice to our server",
            "Crawl-delay: 1"
        ])
    else:
        robots_lines.extend([
            "Disallow: /api/",
            "Disallow: /admin/",
            "Allow: /"
        ])

    robots_lines.extend([
        "",
        "# Sitemap location",
        f"Sitemap: {sitemap_url}"
    ])

    return '\n'.join(robots_lines) + '\n'
