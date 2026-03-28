import re

with open('src/components/businesscard/premium-cards.css', 'r') as f:
    css = f.read()

# Fix clamp functions with rem
def repl_rem(m):
    # m.group(1) is the min value
    old_min = float(m.group(1))
    new_min = old_min * 0.3 # drastically reduce minimum sizes to allow shrinking
    return f"clamp({new_min:.2f}rem, {m.group(2)}cqw, {m.group(3)}rem)"

css = re.sub(r'clamp\s*\(\s*([\d\.]+)rem\s*,\s*([\d\.]+)cqw\s*,\s*([\d\.]+)rem\s*\)', repl_rem, css)

# Fix clamp functions with px
def repl_px(m):
    old_min = float(m.group(1))
    new_min = max(0, old_min * 0.3)
    return f"clamp({new_min:.1f}px, {m.group(2)}cqw, {m.group(3)}px)"

css = re.sub(r'clamp\s*\(\s*([\d\.]+)px\s*,\s*([\d\.]+)cqw\s*,\s*([\d\.]+)px\s*\)', repl_px, css)

# Fix specific spacing issues
css = css.replace("top: 5%;", "top: 15%;")
css = css.replace("margin-bottom: 2rem;", "margin-bottom: clamp(0.5rem, 5cqw, 2rem);")
css = css.replace("margin-bottom: 1rem;", "margin-bottom: clamp(0.25rem, 3cqw, 1rem);")
css = css.replace("margin-bottom: 1.5rem;", "margin-bottom: clamp(0.5rem, 4cqw, 1.5rem);")

with open('src/components/businesscard/premium-cards.css', 'w') as f:
    f.write(css)
