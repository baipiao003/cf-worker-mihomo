#!/bin/sh

current_tag=$(git describe --tags --abbrev=0)
previous_tag=$(git describe --tags --abbrev=0 "$current_tag^")
version_range="$previous_tag...$current_tag"

if [ -n "$GITHUB_REPOSITORY" ]; then
	repo=$GITHUB_REPOSITORY
else
	repo=$(git remote get-url origin | sed \
		-e 's#.*github.com[:/]##' \
		-e 's#\.git$##')
fi

{
	echo "## What's Changed"
	git log "$version_range" --pretty=format:"* %h %s"
	echo
	echo
	echo "**Full Changelog**: https://github.com/$repo/compare/$version_range"
} >release.md
