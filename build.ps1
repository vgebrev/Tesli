param (
    [string]$config = "staging",
    [string]$deployRoot = "E:\TesliDeployments\$config"
)


Write-Output "Building $config";

dotnet test .\back-end\tests\tests.csproj;

Write-Output "dotnet test exited with code: $LastExitCode";
if ($LastExitCode -ne 0) { exit $LastExitCode; }

Push-Location .\front-end
ng test --watch=false
Write-Output "ng test exited with code: $LastExitCode"
if ($LastExitCode -ne 0) { Pop-Location; exit $LastExitCode; }
Pop-Location;

dotnet publish .\back-end\api --configuration $config --output $deployRoot\back-end\api;

Write-Output "dotnet publish exited with code: $LastExitCode";
if ($LastExitCode -ne 0) { exit $LastExitCode; }

Push-Location .\front-end
ng build --configuration $config
Pop-Location; 
Write-Output "ng build exited with code: $LastExitCode";
if ($LastExitCode -ne 0) { exit $LastExitCode; }

Remove-Item $deployRoot\front-end\*.*;
Copy-Item .\front-end\dist\Tesli\*.* -Destination $deployRoot\front-end -Force;
exit $LastExitCode;