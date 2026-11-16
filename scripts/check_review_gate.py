#!/usr/bin/env python3
"""Validate required review metadata on GitHub pull-request events.

A metadata gate complements tests and human review; it cannot judge review quality.
"""
import argparse
import json
import re
import sys
from pathlib import Path

FIELDS = ('SELF-REVIEW','QA EVIDENCE','OPEN ISSUES','OWNER ACCEPTANCE')

def check(body):
    errors=[]
    values={}
    for field in FIELDS:
        match=re.search(rf'(?im)^{re.escape(field)}:[ \t]*([^\r\n]*)$',body)
        if not match or not (match.group(1) or '').strip():
            errors.append(f'{field} missing or empty')
        else:
            values[field]=match.group(1).strip()
    if 'QA EVIDENCE' in values and (len(values['QA EVIDENCE']) < 24 or not any(token in values['QA EVIDENCE'] for token in ('qa/', 'scripts/', 'http', 'CI ', 'tests'))):
        errors.append('QA EVIDENCE must link to or identify substantive test evidence')
    if values.get('SELF-REVIEW')!='PASS':
        errors.append('SELF-REVIEW must equal PASS for the review gate')
    if values.get('OWNER ACCEPTANCE') not in ('PENDING','APPROVED'):
        errors.append('OWNER ACCEPTANCE must be PENDING or APPROVED (distinct from self-review)')
    return errors

if __name__ == '__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--event',type=Path,help='GitHub Actions event JSON; non-PR events skip metadata check')
    parser.add_argument('--body',type=Path,help='File containing a PR body for local validation')
    args=parser.parse_args()
    if args.body:
        content=args.body.read_text()
    elif args.event:
        event=json.loads(args.event.read_text())
        if 'pull_request' not in event:
            print('Self-review metadata gate: skipped (not a PR event)')
            sys.exit(0)
        content=event['pull_request'].get('body') or ''
    else:
        parser.error('provide --event or --body')
    problems=check(content)
    if problems:
        print('Self-review metadata gate: FAIL')
        for problem in problems:print(' -',problem)
        sys.exit(1)
    print('Self-review metadata gate: PASS (format only; not independent approval)')
