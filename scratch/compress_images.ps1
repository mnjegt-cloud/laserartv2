Add-Type -AssemblyName System.Drawing
$images = Get-ChildItem "c:\Users\Alex\Desktop\laserart\public\images\*" -Include *.png, *.jpg, *.jpeg
foreach ($img in $images) {
    if ($img.Length -gt 100kb) {
        Write-Host "Processing $($img.Name) ($($img.Length / 1kb) KB)..."
        try {
            $bmp = [System.Drawing.Bitmap]::FromFile($img.FullName)
            $encoder = [System.Drawing.Imaging.Encoder]::Quality
            $params = New-Object System.Drawing.Imaging.EncoderParameters(1)
            $params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($encoder, 50) # 50% quality
            $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
            
            $newName = $img.FullName
            if ($img.Extension -ne ".jpg") {
                $newName = [System.IO.Path]::ChangeExtension($img.FullName, ".jpg")
            }
            
            # Save to temporary file first to avoid locking
            $tempName = $newName + ".tmp"
            $bmp.Save($tempName, $codec, $params)
            $bmp.Dispose()
            
            # Replace original
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
