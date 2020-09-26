#!/bin/bash -e
mkdir pipelines
COMMITS="$(git log --cherry-pick --pretty=format:"* %s" --no-merges --right-only origin/master...$BITBUCKET_COMMIT)"
awk '/\* [A-Z]/,//' <<< "$COMMITS" > ./pipelines/changelog.txt
touch ./pipelines/deployment-vars.sh
echo "VERSION_LABEL='$(date +%Y%m%d)-$BITBUCKET_BRANCH-${BITBUCKET_COMMIT:0:8}'" >> ./pipelines/deployment-vars.sh
echo "LAST_AUTHOR='$(git show -s --format="%an" HEAD)'" >> ./pipelines/deployment-vars.sh
echo "CHANGELOG="'$(cat '"<<CHANGELOGEOF
$(<./pipelines/changelog.txt)
CHANGELOGEOF
)" >> ./pipelines/deployment-vars.sh
