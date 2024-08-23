export async function ImportSvg(name: String): Promise<String> {
    const response = await import(`../assets/vectors/${name}.svg?raw`);
    return response.default as String;
}