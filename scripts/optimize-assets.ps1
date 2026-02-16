param(
  [string]$AssetsDir = (Join-Path $PSScriptRoot "..\\src\\assets")
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

function Resize-Png {
  param(
    [Parameter(Mandatory=$true)][string]$InFile,
    [Parameter(Mandatory=$true)][string]$OutFile,
    [Parameter(Mandatory=$true)][int]$Width
  )

  if (Test-Path $OutFile) { Remove-Item $OutFile -Force }

  $img = [System.Drawing.Image]::FromFile($InFile)
  try {
    $newW = [int]$Width
    $newH = [int][math]::Round($img.Height * $newW / $img.Width)

    $bmp = [System.Drawing.Bitmap]::new($newW, $newH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    try {
      $g = [System.Drawing.Graphics]::FromImage($bmp)
      try {
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.DrawImage($img, 0, 0, $newW, $newH)
      } finally {
        $g.Dispose()
      }

      $bmp.Save($OutFile, [System.Drawing.Imaging.ImageFormat]::Png)
    } finally {
      $bmp.Dispose()
    }
  } finally {
    $img.Dispose()
  }
}

function FlattenTo-Jpeg {
  param(
    [Parameter(Mandatory=$true)][string]$InFile,
    [Parameter(Mandatory=$true)][string]$OutFile,
    [Parameter(Mandatory=$true)][int]$MaxWidth,
    [Parameter(Mandatory=$true)][int]$Quality
  )

  if (Test-Path $OutFile) { Remove-Item $OutFile -Force }

  $img = [System.Drawing.Image]::FromFile($InFile)
  try {
    $w = $img.Width
    $h = $img.Height
    $newW = [int][math]::Min($w, $MaxWidth)
    $newH = [int][math]::Round($h * $newW / $w)

    $bmp = [System.Drawing.Bitmap]::new($newW, $newH, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
    try {
      $g = [System.Drawing.Graphics]::FromImage($bmp)
      try {
        $g.Clear([System.Drawing.Color]::White)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.DrawImage($img, 0, 0, $newW, $newH)
      } finally {
        $g.Dispose()
      }

      $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
      $encParams = [System.Drawing.Imaging.EncoderParameters]::new(1)
      try {
        $encParams.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new([System.Drawing.Imaging.Encoder]::Quality, [long]$Quality)
        $bmp.Save($OutFile, $codec, $encParams)
      } finally {
        $encParams.Dispose()
      }
    } finally {
      $bmp.Dispose()
    }
  } finally {
    $img.Dispose()
  }
}

$assetsPath = (Resolve-Path $AssetsDir).Path

Resize-Png -InFile (Join-Path $assetsPath "conlogo.png") -OutFile (Join-Path $assetsPath "conlogo-256.png") -Width 256
FlattenTo-Jpeg -InFile (Join-Path $assetsPath "1.png") -OutFile (Join-Path $assetsPath "step-1.jpg") -MaxWidth 1024 -Quality 78
FlattenTo-Jpeg -InFile (Join-Path $assetsPath "2.png") -OutFile (Join-Path $assetsPath "step-2.jpg") -MaxWidth 1280 -Quality 78
FlattenTo-Jpeg -InFile (Join-Path $assetsPath "get_in_touch.png") -OutFile (Join-Path $assetsPath "get-in-touch.jpg") -MaxWidth 1024 -Quality 78

Get-ChildItem (Join-Path $assetsPath "conlogo-256.png"), (Join-Path $assetsPath "step-1.jpg"), (Join-Path $assetsPath "step-2.jpg"), (Join-Path $assetsPath "get-in-touch.jpg") |
  Select-Object Name, Length

