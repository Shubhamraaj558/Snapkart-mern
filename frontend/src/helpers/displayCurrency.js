const displayINRCurrency = (num) => {
    // Agar num undefined ya null hai toh crash hone se bachne ke liye 0 pass kar do
    if (!num) {
        num = 0;
    }

    const formatter = new Intl.NumberFormat('en-IN', {
        style: "currency",
        currency: 'INR',
        minimumFractionDigits: 2
    })

    return formatter.format(num)
}

export default displayINRCurrency