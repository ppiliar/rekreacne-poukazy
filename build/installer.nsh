!macro customInstall
  DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\b4c57f5c-e464-5635-b457-67f02848c47b"
  RMDir /r "$LOCALAPPDATA\${APP_FILENAME}-updater"
!macroend

!macro customRemoveFiles
  RMDir /r "$LOCALAPPDATA\${APP_FILENAME}-updater"
!macroend