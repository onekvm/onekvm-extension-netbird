POCKETJS ?= $(abspath ../../tmp/pocketjs)
BUN ?= bun
FONT_REG ?= $(abspath ../../onekvm-screen-display/.fonts/NotoSansCJK-SC-Regular.otf)
FONT_BOLD ?= $(abspath ../../onekvm-screen-display/.fonts/NotoSansCJK-SC-Bold.otf)
OUT_DIR ?= $(CURDIR)/dist

.PHONY: all clean

all:
	test -f "$(POCKETJS)/tools/build.ts"
	test -f "$(FONT_REG)"
	test -f "$(FONT_BOLD)"
	$(BUN) "$(POCKETJS)/tools/build.ts" "$(CURDIR)/src/main.tsx" \
		--framework=vue-vapor --no-config --project-root="$(CURDIR)" \
		--outdir="$(abspath $(OUT_DIR))" \
		--font-regular="$(FONT_REG)" --font-bold="$(FONT_BOLD)"

clean:
	$(RM) -r "$(OUT_DIR)"
