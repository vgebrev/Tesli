param (
    [string]$config = "staging",
    [string]$deployRoot = "E:\TesliDeployments\$config"
)


Write-Output "Building $config";

dotnet publish .\back-end\api --configuration $config --output $deployRoot\back-end\api;

Push-Location .\front-end
ng build --configuration $config
Pop-Location; 

Remove-Item $deployRoot\front-end\*.*;
Copy-Item .\front-end\dist\Tesli\*.* -Destination $deployRoot\front-end -Force;