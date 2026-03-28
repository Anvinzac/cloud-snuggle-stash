import re

with open('src/components/businesscard/types.ts', 'r') as f:
    content = f.read()

# Update CARD_DESIGNS to remove old ones
new_designs = """export const CARD_DESIGNS = [
  { id: "avant-garde", label: "Avant-Garde" },
  { id: "swiss-grid", label: "Swiss Grid" },
  { id: "fintech", label: "FinTech" },
  { id: "geometric", label: "Geometric" },
  { id: "architect", label: "Architect" },
  { id: "creator", label: "Creator" },
  { id: "watercolor", label: "Watercolor" },
  { id: "oil-portrait", label: "Oil Portrait" },
  { id: "ink-fusion", label: "Ink Fusion" },
] as const;"""

content = re.sub(r'export const CARD_DESIGNS = \[[^\]]+\] as const;', new_designs, content)

# Map old designs to new ones in MOCK_CONTACTS
replacements = {
    '"modern"': '"fintech"',
    '"elegant"': '"architect"',
    '"classic"': '"avant-garde"',
    '"bold"': '"geometric"',
    '"gradient"': '"swiss-grid"',
    '"minimal"': '"creator"'
}

for old, new_val in replacements.items():
    content = content.replace(f'card_design: {old}', f'card_design: {new_val}')

with open('src/components/businesscard/types.ts', 'w') as f:
    f.write(content)

