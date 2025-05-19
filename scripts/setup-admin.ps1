# Read the .env file and set environment variables
Get-Content ../.env | ForEach-Object {
    if ($_ -match '^[^#].*=.*') {
        $key, $value = $_ -split '=', 2
        $value = $value.Trim('"')  # Remove quotes if present
        [Environment]::SetEnvironmentVariable($key, $value)
    }
}

# Run the create-admin script
Write-Host "Running create-admin script..."
npx tsx create-admin.ts
