// Helper for managing children array in localStorage

export function getChildren() {
  try {
    return JSON.parse(localStorage.getItem("children") || "[]");
  } catch {
    return [];
  }
}

export function addChild(child: any) {
  const children = getChildren();
  children.push(child);
  localStorage.setItem("children", JSON.stringify(children));
}

export function clearChildren() {
  localStorage.removeItem("children");
}
