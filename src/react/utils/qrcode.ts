/**
 * Utility function to generate QR codes with custom styling and logo
 */

export async function generateStyledQRCode(
    value: string,
    options: {
        size?: number
        logoImage?: string
        logoWidth?: number
    } = {}
): Promise<string> {
    const {
        size = 800,
        logoImage = '/assets/images/icons/icon-512x512.png',
        logoWidth = 200,
    } = options

    const QRCode = (await import('qrcode')).default

    // Crea un canvas
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size

    // Genera il QR code di base sul canvas
    await QRCode.toCanvas(canvas, value, {
        width: size,
        margin: 2,
        errorCorrectionLevel: 'H',
        color: {
            dark: '#000000',
            light: '#FFFFFF',
        },
    })

    const ctx = canvas.getContext('2d')
    if (!ctx) {
        throw new Error('Impossibile ottenere il contesto del canvas')
    }

    // Carica e aggiungi il logo
    if (logoImage) {
        const logo = new Image()
        logo.crossOrigin = 'anonymous'

        await new Promise((resolve, reject) => {
            logo.onload = resolve
            logo.onerror = reject
            logo.src = logoImage
        })

        // Calcola la posizione centrale per il logo
        const logoSize = logoWidth
        const logoX = (size - logoSize) / 2
        const logoY = (size - logoSize) / 2

        // Disegna un cerchio bianco dietro il logo
        const padding = 10
        const circleRadius = (logoSize + padding * 2) / 2
        const circleCenterX = size / 2
        const circleCenterY = size / 2

        ctx.fillStyle = '#FFFFFF'
        ctx.beginPath()
        ctx.arc(circleCenterX, circleCenterY, circleRadius, 0, 2 * Math.PI)
        ctx.fill()

        // Disegna il logo al centro
        ctx.drawImage(logo, logoX, logoY, logoSize, logoSize)
    }

    // Converti il canvas in data URL
    return canvas.toDataURL('image/png')
}
