#!/usr/bin/env bash
# @terran
# set -e -u
# set -e
trap '{ echo "pressed Ctrl-C.  Time to quit." ; exit 1; }' INT
export PATH="/usr/local/bin:$PATH"

dir=$(
    cd $(dirname $0) && pwd
)
tmp=$dir/.tmp
mkdir -p $tmp
function error_exit() { echo "【ERROR】::${1:-"Unknown Error"}" 1>&2 && exit 1; }

source .env
oss_cmd="ossutilmac64 -e $oss_host -i $oss_accessid -k $oss_accesskey"

echo $oss_cmd

function upload() {
    local game="library_dist"
    while [ "$#" -gt 0 ]; do
        case "$1" in
            -g | --game) game="$2" && shift ;;
            --game=*) game="${1#*=}" ;;
            -f | --file) file="$2" && shift ;;
            --file=*) file="${1#*=}" ;;
            *) file="$1" ;;
        esac
        shift
    done

    if [ -z ${file+x} ]; then error_exit "need file"; fi
    $oss_cmd cp -f $file oss://$oss_context/$game/ || error_exit "notice upload error"
}

function build() {
    local dist="$dir/build"
    rm -rf $dist && (cd $dir/source && npx gulp build)
}

function release() {
    local comment="empty"

    while [ "$#" -gt 0 ]; do
        case "$1" in
            -m | --comment) comment="$2" && shift ;;
        esac
        shift
    done

    local sourceDir=$dir/source

    json -I -f $sourceDir/package.json -e "!function(self){var arr = self.version.split('.').map(v=>+v);arr[arr.length-1]+=1;self.version=arr.join('.')}(this)"

    local name=$(cat $sourceDir/package.json | json name)
    local version=$(cat $sourceDir/package.json | json version)

    # git add .;
    # git commit . -m "release:${version} ${comment}";
    # git tag -a v${version} -m "release:${version}";
    # git push

    build || error_exit "build error"

    (cd $sourceDir && npm pack) || error_exit "pack error"

    cp -f $sourceDir/$name-$version.tgz $sourceDir/dist
    upload $sourceDir/dist/$name-$version.tgz

    mv -f $sourceDir/$name-$version.tgz $sourceDir/dist/$name-latest.tgz
    upload $sourceDir/dist/$name-latest.tgz
}

if test $# -lt 1; then error_exit "wrong arguments"; fi
cmd=$1 && shift
echo $cmd $@
$cmd $@
