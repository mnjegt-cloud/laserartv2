Add-Type -AssemblyName System.Drawing
$images = Get-ChildItem "c:\Users\Alex\Desktop\laserart\public\images\*" -Include *.png, *.jpg, *.jpeg
foreach ($img in $images) {
    if ($img.Length -gt 100kb) {
        Write-Host "Aggressive processing $($img.Name) ($($img.Length / 1kb) KB)..."
        try {
            $bmp = [System.Drawing.Bitmap]::FromFile($img.FullName)
            $encoder = [System.Drawing.Imaging.Encoder]::Quality
            $params = New-Object System.Drawing.Imaging.EncoderParameters(1)
            $params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($encoder, 30) # 30% quality for small size
            $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
            
            $newName = $img.FullName
            if ($img.Extension -ne ".jpg") {
                $newName = [System.IO.Path]::ChangeExtension($img.FullName, ".jpg")
            }
            
            $tempName = $newName + ".tmp2"
            $bmp.Save($tempName, $codec, $params)
            $bmp.Dispose()
            
            if ($img.FullName -ne $newName) {
                Remove-Item $img.FullName
            }
            Move-Item -Path $tempName -Destination $newName -Force
            Write-Host "  -> Compressed to $( (Get-Item $newName).Length / 1kb) KB"
        } catch {
            Write-Host "  !! Error processing $($img.Name): $_"
        }
    }
}
