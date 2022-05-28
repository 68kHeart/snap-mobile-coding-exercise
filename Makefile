# Directories

SRC   = src
TESTS = tests
BUILD = build

# Binaries

NPX = npx

#
# TypeScript
#

TS_ENTRY  = $(SRC)/rpn-calc.ts
TS_FILES  = $(shell find $(SRC) -name '*.ts' -type f)
TS_TARGET = $(patsubst $(SRC)/%.ts, $(BUILD)/%.js, $(TS_ENTRY))

TSC       = $(NPX) tsc
TSC_ARGS += --rootDir $(SRC)
TSC_ARGS += --outDir $(BUILD)

$(TS_TARGET): $(TS_FILES)
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
# Jest
#

JEST_CONFIG = jest.config.json

JEST       = $(NPX) jest
JEST_ARGS += --config $(JEST_CONFIG)

#
# Targets
#

.PHONY: build test test-style test-unit

build: $(TS_TARGET)

test: test-style test-unit

test-style: $(ESLINT_CONFIG) $(TS_FILES)
	echo "Checking code style..."
	$(ESLINT) $(ESLINT_ARGS) $(TS_FILES)
	echo "Code style is good!"

test-unit: $(JEST_CONFIG) $(TEST_FILES)
	echo "Performing unit tests..."
	$(JEST) $(JEST_ARGS) $(TESTS) # 1>/dev/null
	echo "Unit tests passed!"
	

# Shh! (Unless we specify VERBOSE when invoking make)

ifndef VERBOSE
.SILENT:
endif
