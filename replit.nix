{pkgs}: {
  deps = [
    pkgs.postgresql
    pkgs.nodePackages_latest.bash-language-server
    pkgs.bash-completion
    pkgs.bash
    pkgs.runtimeShellPackage
    pkgs.docker_26
    pkgs.chopchop
    pkgs.vimPlugins.LanguageClient-neovim
  ];
}
