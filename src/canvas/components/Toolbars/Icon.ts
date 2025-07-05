const icon = (iconName: string): string => {
    const ic = document.createElement('i')
    return ic.innerHTML = `<i class=${iconName}></i>`
}

export default icon;