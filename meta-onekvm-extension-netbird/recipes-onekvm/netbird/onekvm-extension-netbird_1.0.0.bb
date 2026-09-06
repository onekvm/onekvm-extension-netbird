SUMMARY = "OneKVM NetBird service extension"
HOMEPAGE = "https://netbird.io/"
LICENSE = "MIT & BSD-3-Clause"
LIC_FILES_CHKSUM = "\
    file://LICENSE;md5=4b4d2ea45bb882ef18ae0022ccc1f9ab \
    file://src/github.com/netbirdio/netbird/LICENSE;md5=4b0c257c801017efd43194ff660ef008 \
    file://pkg/mod/codeberg.org/cunicu/circl@v0.0.0-20230801113412-fec58fc7b5f6/LICENSE;md5=71d73ee3b01fb1fe8499f3da2593ecc7;spdx=BSD-3-Clause \
    file://pkg/mod/github.com/aws/aws-sdk-go-v2@v1.38.3/internal/sync/singleflight/LICENSE;md5=bdc234595bc2fe370918f5de5077c8e9;spdx=BSD-3-Clause \
    file://pkg/mod/github.com/aws/smithy-go@v1.23.0/LICENSE;md5=34400b68072d710fecd0a2940a0d1658;spdx=Apache-2.0 \
    file://pkg/mod/github.com/coder/websocket@v1.8.14/LICENSE.txt;md5=6be4dff96499e563e8b776f92bf18876;spdx=ISC \
    file://pkg/mod/github.com/fsnotify/fsnotify@v1.9.0/LICENSE;md5=8bae8b116e2cfd723492b02d9a212fe2;spdx=BSD-3-Clause \
    file://pkg/mod/github.com/gliderlabs/ssh@v0.3.8/LICENSE;md5=ac631f842784b8ec269293a49121236b;spdx=BSD-3-Clause \
    file://pkg/mod/github.com/google/gopacket@v1.1.19/LICENSE;md5=b32b347fe7ed4541e05033e8b0b29001;spdx=BSD-3-Clause \
    file://pkg/mod/github.com/gopacket/gopacket@v1.4.0/LICENSE;md5=b32b347fe7ed4541e05033e8b0b29001;spdx=BSD-3-Clause \
    file://pkg/mod/github.com/grpc-ecosystem/grpc-gateway/v2@v2.26.3/LICENSE;md5=c510a2a01572b82d27f28fd4d02ca318;spdx=BSD-3-Clause \
    file://pkg/mod/github.com/hashicorp/go-version@v1.7.0/LICENSE;md5=81eb103d8076ec72ebe52e3ee40176db;spdx=MPL-2.0 \
    file://pkg/mod/github.com/klauspost/compress@v1.18.3/internal/snapref/LICENSE;md5=b8b79c7d4cda128290b98c6a21f9aac6;spdx=BSD-3-Clause \
    file://pkg/mod/github.com/kr/fs@v0.1.0/LICENSE;md5=591778525c869cdde0ab5a1bf283cd81;spdx=BSD-3-Clause \
    file://pkg/mod/github.com/libp2p/go-netroute@v0.4.0/LICENSE;md5=b5421318be42c8731941955b25008cf3;spdx=BSD-3-Clause \
    file://pkg/mod/github.com/lrh3321/ipset-go@v0.0.0-20250619021614-54a0a98ace81/LICENSE;md5=909c8d5223dc6ee4f38c2c2cb8f7d9c9;spdx=Apache-2.0 \
    file://pkg/mod/github.com/miekg/dns@v1.1.72/COPYRIGHT;md5=2ba6b7bd91e16af46a856eca87db2504;spdx=BSD-3-Clause \
    file://pkg/mod/github.com/spf13/cobra@v1.10.2/LICENSE.txt;md5=920d76114a32b0fb75b3f2718c5a91be;spdx=Apache-2.0 \
    file://pkg/mod/github.com/spf13/pflag@v1.0.10/LICENSE;md5=1e8b7dc8b906737639131047a590f21d;spdx=BSD-3-Clause \
    file://pkg/mod/github.com/vishvananda/netlink@v1.3.1/LICENSE;md5=2ade771c7d7211af507864e8dd520529;spdx=Apache-2.0 \
    file://pkg/mod/github.com/vishvananda/netns@v0.0.5/LICENSE;md5=2ade771c7d7211af507864e8dd520529;spdx=Apache-2.0 \
    file://pkg/mod/gvisor.dev/gvisor@v0.0.0-20260219192049-0f2374377e89/LICENSE;md5=e566fe37b81dd469e93876dc021ca01c;spdx=Apache-2.0 \
"
PR = "r2"

NETBIRD_VERSION = "0.76.1"
GO_IMPORT = "github.com/netbirdio/netbird"
GO_INSTALL = "${GO_IMPORT}/client"

ONEKVM_COMPONENT_GIT_URI ??= "git://github.com/onekvm/onekvm-extension-netbird.git;protocol=https;branch=main"
ONEKVM_COMPONENT_SRCREV ??= ""
SRC_URI = "\
    ${ONEKVM_COMPONENT_GIT_URI};name=extension;destsuffix=extension \
    git://github.com/netbirdio/netbird.git;protocol=https;nobranch=1;name=upstream;destsuffix=${GO_SRCURI_DESTSUFFIX} \
    file://0001-netbird-do-not-log-expected-sso-probe-as-error.patch;patchdir=${GO_SRCURI_DESTSUFFIX} \
"
SRCREV_extension = "${ONEKVM_COMPONENT_SRCREV}"
SRCREV_upstream = "0780a806f2cc2e8a6a51782cfffe0591b7c3fa9c"
SRCREV_FORMAT = "extension_upstream"
S = "${UNPACKDIR}/extension"

include onekvm-extension-netbird-go-mods.inc
include onekvm-extension-netbird-licenses.inc

inherit go-mod go-mod-update-modules onekvm-extension

DEPENDS += "json-c"
CGO_ENABLED = "0"
GOBUILDFLAGS:remove = "-buildmode=pie"
GOWORK = "off"
GOTOOLCHAIN = "local"
export GOWORK
export GOTOOLCHAIN

ONEKVM_EXTENSION_ID = "netbird"
ONEKVM_EXTENSION_API_VERSION = "2"
ONEKVM_EXTENSION_MANIFEST_TEMPLATE = "${S}/manifest.json.in"

PACKAGES = "${PN}-dbg netbird ${PN}"
FILES:${PN} = "\
    ${ONEKVM_EXTENSION_ROOT}/bin/onekvm-netbird-controller \
    ${ONEKVM_EXTENSION_ROOT}/manifest.json \
    ${ONEKVM_EXTENSION_ROOT}/web \
"
FILES:netbird = "${ONEKVM_EXTENSION_ROOT}/bin/netbird"
RDEPENDS:${PN} += "netbird"
RREPLACES:netbird += "${PN}-runtime (<= 1.0.0-r1)"
RCONFLICTS:netbird += "${PN}-runtime (<= 1.0.0-r1)"
RDEPENDS:${PN}:append:onekvm-nanokvm = " \
    onekvm-kernel-module-wireguard \
    onekvm-kernel-module-netfilter \
"

do_compile() {
    install -d ${B}/bin
    ${CXX} ${CXXFLAGS} -I${STAGING_INCDIR} \
        ${S}/src/main.cpp ${STAGING_LIBDIR}/libjson-c.a -lm ${LDFLAGS} \
        -o ${B}/bin/onekvm-netbird-controller

    cd ${S}/src/${GO_IMPORT}
    ${GO} build ${GOBUILDFLAGS} -o ${B}/bin/netbird ./client
}
do_compile[dirs] = "${B}"

do_install() {
    oe_runmake -C ${S} install \
        CONTROLLER_BINARY=${B}/bin/onekvm-netbird-controller \
        RUNTIME_BINARY=${B}/bin/netbird \
        DESTDIR=${D} PREFIX=${ONEKVM_EXTENSION_ROOT} \
        VERSION=${PV} ARCH=${TARGET_ARCH}
}
