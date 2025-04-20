export const handleGithubButton = (githubURL: string) => {
    if (!githubURL) return;
    window.open(githubURL,'_blank');
}