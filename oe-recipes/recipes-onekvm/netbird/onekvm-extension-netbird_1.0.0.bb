SUMMARY = "OneKVM NetBird service extension"
HOMEPAGE = "https://netbird.io/"
LICENSE = "GPL-3.0-only & BSD-3-Clause"
LIC_FILES_CHKSUM = "\
    file://LICENSE;md5=1ebbd3e34237af26da5dc08a4e440464 \
    file://src/github.com/netbirdio/netbird/LICENSE;md5=4b0c257c801017efd43194ff660ef008 \
"
PR = "r3"

NETBIRD_VERSION = "0.78.1"
GO_IMPORT = "github.com/netbirdio/netbird"
GO_INSTALL = "${GO_IMPORT}/client"

ONEKVM_COMPONENT_GIT_URI ??= "git://github.com/onekvm/onekvm-extension-netbird.git;protocol=https;branch=main"
ONEKVM_COMPONENT_SRCREV ??= ""
SRC_URI = "\
    ${ONEKVM_COMPONENT_GIT_URI};name=extension;destsuffix=extension \
    git://github.com/netbirdio/netbird.git;protocol=https;nobranch=1;name=upstream;destsuffix=${GO_SRCURI_DESTSUFFIX} \
    file://0001-netbird-do-not-log-expected-sso-probe-as-error.patch;patchdir=src/${GO_IMPORT} \
"
SRCREV_extension = "${ONEKVM_COMPONENT_SRCREV}"
SRCREV_upstream = "23a1487c26c5f00353c046bc818069189650dbfb"
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
