# Directories

SRC   = src
BUILD = build

# Binaries

NPX = npx

#
# TypeScript
#

TS_FILES   = $(shell find $(SRC) -name '*.ts' -type f)
TS_TARGETS = $(patsubst $(SRC)/%.ts, $(BUILD)/%.js, $(TS_FILES))

TSC       = $(NPX) tsc
TSC_ARGS += --rootDir $(SRC)
TSC_ARGS += --outDir $(BUILD)

$(BUILD)/%.js: $(SRC)/%.ts
	mkdir -p $(BUILD)
	echo "Compiling Typescript code..."
	$(TSC) $(TSC_ARGS)
	echo "TypeScript code compiled!"

#
# ESLint
#

ESLINT_CONFIG = .eslintrc.json

ESLINT       = $(NPX) eslint
ESLINT_ARGS += --config $(ESLINT_CONFIG)

#
# Targets
#

.PHONY: build test

build: $(TS_TARGETS)

test: $(ESLINT_CONFIG) $(TS_FILES)
	echo "Checking code style..."
	$(ESLINT) $(ESLINT_ARGS) $(TS_FILES)
	echo "Code style is good!"

# Shh! (Unless we specify VERBOSE when invoking make)

ifndef VERBOSE
.SILENT:
endif
    