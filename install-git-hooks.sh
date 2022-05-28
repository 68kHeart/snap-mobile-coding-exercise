#!/bin/sh
#
# Install git hooks that help with development.

GIT_ROOT="$(git rev-parse --show-toplevel)/.git"

# Create pre-commit hook

PRECOMMIT_HOOK="$GIT_ROOT/hooks/pre-commit"

echo "Installing pre-commit hook..."
cat << 'EOF' > "$PRECOMMIT_HOOK"
#!/bin/sh
#
# Called by "git commit". Verifies code passes tests before being committed.

exec make test
EOF

chmod u+x "$PRECOMMIT_HOOK"

# Done!

echo "Hooks installed!"
