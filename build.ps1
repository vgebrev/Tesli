#FIXME: IIS currently needs manual configuration, which could be automated in this script.

param (
    [string]$config = "staging", #staging | production
    [string]$deployRoot = "E:\TesliDeployments\$config" #\front-end and \back-end\api are copied\published under the deployRoot. 
)

Write-Output "Building $config";

#Back-end tests
dotnet test .\back-end\Tesli.Tests\Tesli.Tests.csproj;
Write-Output "Back-end tests step exited with code: $LastExitCode";
if ($LastExitCode -ne 0) { exit $LastExitCode; }

#Front-end tests
Push-Location .\front-end
ng test --watch=false
Write-Output "Front-end tests step exited with code: $LastExitCode"
if ($LastExitCode -ne 0) { Pop-Location; exit $LastExitCode; }
Pop-Location;

#Back-end publish
dotnet publish .\back-end\Tesli.Api --configuration $config --output $deployRoot\back-end\api;
Write-Output "Back-end publish step exited with code: $LastExitCode";
if ($LastExitCode -ne 0) { exit $LastExitCode; }

#Database update
Push-Location .\back-end\Tesli.Database.Sqlite
dotnet run "$deployRoot\back-end\api\data\tesli.$config.db"
Write-Output "Database update step exited with code: $LastExitCode";
if ($LastExitCode -ne 0) { exit $LastExitCode; }
Pop-Location;

#Front-end build
Push-Location .\front-end
ng build --configuration $config
Pop-Location; 
Write-Output "Front-end build step exited with code: $LastExitCode";
if ($LastExitCode -ne 0) { exit $LastExitCode; }

#Front-end publish
Remove-Item $deployRoot\front-end\*.*;
Copy-Item .\front-end\dist\Tesli\*.* -Destination $deployRoot\front-end -Force;
Write-Output "Front-end publish step exited with code: $LastExitCode";
exit $LastExitCode;