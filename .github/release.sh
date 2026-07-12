#!/bin/sh
set -e

current_tag=$(git describe --tags --abbrev=0)

previous_tag=$(git describe --tags --abbrev=0 "$current_tag^" 2>/dev/null || echo "")

if [ -n "$previous_tag" ]; then
	version_range="$previous_tag...$current_tag"
else
	version_range="$current_tag"
fi

if [ -n "$GITHUB_REPOSITORY" ]; then
	repo=$GITHUB_REPOSITORY
else
	repo=$(git remote get-url origin | sed \
		-e 's#.*github.com[:/]##' \
		-e 's#\.git$##')
fi

{
	echo "## What's Changed"

	if [ -n "$previous_tag" ]; then
		git log "$version_range" --pretty=format:"* %h %s"
	else
		git log "$current_tag" --pretty=format:"* %h %s"
	fi

	echo
	echo
	echo "**Full Changelog**: https://github.com/$repo/compare/$version_range"
} >release.md
