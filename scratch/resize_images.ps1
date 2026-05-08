Add-Type -AssemblyName System.Drawing
$images = Get-ChildItem "c:\Users\Alex\Desktop\laserart\public\images\*" -Include *.png, *.jpg, *.jpeg
foreach ($img in $images) {
    if ($img.Length -gt 100kb) {
        Write-Host "Resizing & Compressing $($img.Name) ($($img.Length / 1kb) KB)..."
        try {
            $origBmp = [System.Drawing.Bitmap]::FromFile($img.FullName)
            
            # Target width 800px (maintain aspect ratio)
            $newWidth = 800
            if ($origBmp.Width -lt $newWidth) { $newWidth = $origBmp.Width }
            $newHeight = [int]($origBmp.Height * ($newWidth / $origBmp.Width))
            
            $newBmp = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
            $g = [System.Drawing.Graphics]::FromImage($newBmp)
            $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $g.DrawImage($origBmp, 0, 0, $newWidth, $newHeight)
            $g.Dispose()
            $origBmp.Dispose()
            
            $encoder = [System.Drawing.Imaging.Encoder]::Quality
            $params = New-Object System.Drawing.Imaging.EncoderParameters(1)
            $params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($encoder, 60) # 60% with resize is usually <100KB
            $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
            
            $newName = $img.FullName
            if ($img.Extension -ne ".jpg") {
                $newName = [System.IO.Path]::ChangeExtension($img.FullName, ".jpg")
            }
            
            $tempName = $newName + ".resized.tmp"
            $newBmp.Save($tempName, $codec, $params)
            $newBmp.Dispose()
            
            if ($img.FullName -ne $newName) {
                Remove-Item $img.FullName
            }
            Move-Item -Path $tempName -Destination $newName -Force
            Write-Host "  -> Final Size: $( (Get-Item $newName).Length / 1kb) KB"
        } catch {
            Write-Host "  !! Error: $_"
        }
    }
}
