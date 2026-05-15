export default function titleHandler(title: string): boolean {
	if ((document.title = `nogc's blog - ${title}`)) return true;
	return false;
}
