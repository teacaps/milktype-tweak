export default function getIconColor(isSelected: boolean) {
  return {
    style: {
      color: isSelected ? 'var(--color-accent-100)' : 'var(--color-dark-100)',
    },
  };
}
