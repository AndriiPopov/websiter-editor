export const rgbaToObj = (rgba: string) => {
    const rgbaArray = rgba.substring(rgba.indexOf('(') + 1, rgba.indexOf(')')).split(',');
    return {
        r: parseInt(rgbaArray[0]),
        g: parseInt(rgbaArray[1]),
        b: parseInt(rgbaArray[2]),
        a: parseFloat(rgbaArray[3]) || 1,
    }
}

export const objToRgba = (color: Object) => `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;