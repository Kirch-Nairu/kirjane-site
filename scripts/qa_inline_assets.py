"""Inline the original Kirjane background logo in headless QA harnesses.

The real website loads /assets/brand as a normal JPG. Existing browser harnesses
inline visuals because Chromium cannot open the sandbox localhost server. If the
brand image is not inlined, older tests report a false broken-asset regression.
"""
from __future__ import annotations
import base64
from pathlib import Path


def inline_logo_asset(html: str, root: Path) -> str:
    relative = '/assets/brand/kirjane-logo-green-original.jpg'
    if relative not in html:
        return html
    image = root / relative.lstrip('/')
    if not image.is_file():
        raise FileNotFoundError(f'Brand asset missing: {image}')
    return html.replace(relative, 'data:image/jpeg;base64,' + base64.b64encode(image.read_bytes()).decode('ascii'))
