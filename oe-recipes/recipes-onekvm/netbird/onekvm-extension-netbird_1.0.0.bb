SUMMARY = "OneKVM NetBird service extension"
HOMEPAGE = "https://netbird.io/"
LICENSE = "GPL-3.0-only & BSD-3-Clause"
ONEKVM_EXTENSION_SOURCE ?= "${UNPACKDIR}/extension"
ONEKVM_EXTENSION_SOURCE_REV ?= "${ONEKVM_COMPONENT_SRCREV}"
do_compile[vardeps] += "ONEKVM_EXTENSION_SOURCE_REV"
LIC_FILES_CHKSUM = "\
    file://${ONEKVM_EXTENSION_SOURCE}/LICENSE;md5=1ebbd3e34237af26da5dc08a4e440464 \
    file://src/github.com/netbirdio/netbird/LICENSE;md5=34b718d4cf4e380e91eaedb96cc9f1a4 \
"
PR = "r8"

NETBIRD_VERSION = "0.81.2"
GO_IMPORT = "github.com/netbirdio/netbird"
GO_INSTALL = "${GO_IMPORT}/client"
GO_EXTRA_LDFLAGS += "-X ${GO_IMPORT}/version.version=${NETBIRD_VERSION}"

ONEKVM_COMPONENT_GIT_URI ??= "git://github.com/onekvm/onekvm-extension-netbird.git;protocol=https;branch=main"
ONEKVM_COMPONENT_SRCREV ??= ""
SRC_URI = "\
    ${ONEKVM_COMPONENT_GIT_URI};name=extension;destsuffix=extension \
    git://github.com/netbirdio/netbird.git;protocol=https;nobranch=1;name=upstream;destsuffix=${GO_SRCURI_DESTSUFFIX} \
"
SRCREV_extension = "${ONEKVM_COMPONENT_SRCREV}"
SRCREV_upstream = "bb90c9787a8a3591bcb3cccd106a024d1a30b0ef"
SRCREV_FORMAT = "extension_upstream"
S = "${UNPACKDIR}/extension"

include onekvm-extension-netbird-go-mods.inc
include onekvm-extension-netbird-licenses.inc
inherit go-mod go-mod-update-modules onekvm-go-license-review onekvm-extension

DEPENDS += "json-c"
CGO_ENABLED = "0"
GOBUILDFLAGS:remove = "-buildmode=pie"
GOWORK = "off"
GOTOOLCHAIN = "local"
export GOWORK
export GOTOOLCHAIN

ONEKVM_EXTENSION_ID = "netbird"
ONEKVM_EXTENSION_API_VERSION = "2"
ONEKVM_EXTENSION_MANIFEST_TEMPLATE = "${ONEKVM_EXTENSION_SOURCE}/manifest.json.in"

PACKAGES = "${PN}-dbg netbird ${PN}"
FILES:${PN} = "\
    ${ONEKVM_EXTENSION_ROOT}/bin/onekvm-netbird-controller \
    ${ONEKVM_EXTENSION_ROOT}/manifest.json \
    ${ONEKVM_EXTENSION_ROOT}/web \
    ${ONEKVM_EXTENSION_ROOT}/screen-app \
"
FILES:netbird = "${bindir}/netbird"
RDEPENDS:${PN} += " \
    netbird \
    onekvm-kernel-module-wireguard \
    onekvm-kernel-module-netfilter \
"
RREPLACES:netbird += "${PN}-runtime (<= 1.0.0-r1)"
RCONFLICTS:netbird += "${PN}-runtime (<= 1.0.0-r1)"

do_compile() {
    install -d ${B}/bin
    ${CXX} ${CXXFLAGS} -I${STAGING_INCDIR} \
        ${ONEKVM_EXTENSION_SOURCE}/src/main.cpp ${STAGING_LIBDIR}/libjson-c.a -lm ${LDFLAGS} \
        -o ${B}/bin/onekvm-netbird-controller

    cd ${S}/src/${GO_IMPORT}
    ${GO} build ${GOBUILDFLAGS} -o ${B}/bin/netbird ./client
}
do_compile[dirs] = "${B}"

do_install() {
    oe_runmake -C ${ONEKVM_EXTENSION_SOURCE} install \
        CONTROLLER_BINARY=${B}/bin/onekvm-netbird-controller \
        RUNTIME_BINARY=${B}/bin/netbird \
        DESTDIR=${D} PREFIX=${ONEKVM_EXTENSION_ROOT} BINDIR=${bindir} \
        VERSION=${PV} ARCH=${TARGET_ARCH}
}
