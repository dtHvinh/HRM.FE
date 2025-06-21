export function printContent(data: string) {
    const printWindow = window.open('', 'new div', 'height=600,width=800')!;

    if (!printWindow) {
        console.error('Failed to open print window. Pop-ups might be blocked.');
        return false;
    }

    const html = document.createElement('html');
    const head = document.createElement('head');
    const title = document.createElement('title');
    head.appendChild(title);

    const stylesheets = Array.from(document.styleSheets);
    stylesheets.forEach(stylesheet => {
        try {
            if (stylesheet.href) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = stylesheet.href;
                head.appendChild(link);
            } else if (stylesheet.cssRules && stylesheet.cssRules.length > 0) {
                const style = document.createElement('style');
                Array.from(stylesheet.cssRules).forEach(rule => {
                    style.appendChild(document.createTextNode(rule.cssText));
                });
                head.appendChild(style);
            }
        } catch (e) {
            console.warn('Could not access stylesheet rules', e);
        }
    });

    const printStyles = document.createElement('style');
    printStyles.textContent = `
        @media print {
            body { margin: 0; padding: 15mm; }
            @page { size: A4; margin: 10mm; }
        }
    `;
    head.appendChild(printStyles);

    const body = document.createElement('body');
    body.innerHTML = data;

    html.appendChild(head);
    html.appendChild(body);

    printWindow.document.open();
    printWindow.document.appendChild(html);
    printWindow.document.close();

    printWindow.focus();

    setTimeout(() => {
        printWindow.print();
        setTimeout(() => {
            printWindow.close();
        }, 500);
    }, 1000);

    return true;
}