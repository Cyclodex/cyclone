version_file=js/version/lastModified.js
> $version_file
echo "// The version $1 was generated on `date +%d.%m.%Y`
export const appDate = '`date +%d.%m.%Y`';" >> $version_file
#git add $version_file