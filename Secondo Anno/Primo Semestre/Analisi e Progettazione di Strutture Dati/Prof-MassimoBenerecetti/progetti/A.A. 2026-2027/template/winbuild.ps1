param(
    [string]$Target = "all"
)

#!/usr/bin/env pwsh
<#
  PowerShell build script replacing Makefile
  Targets: all, main, run, test, runtest, clean
#>

# --- Configuration -----------------------------------------------------------
$JavaC  = "javac"
$JavaVM = "java"
$JUnitC = "./zapsdtest/zjunit/junit-platform-console-standalone-1.12.1.jar"
$JUnitL = "./zapsdtest/zjunit/*"
$CPath  = ".;$JUnitL"

# --- Source discovery --------------------------------------------------------
$MainSrc = "Main.java"
$APSDSrc = @(Get-ChildItem -Recurse -Filter *.java -Path "apsd" | ForEach-Object { $_.FullName })
$TestSrc = @(Get-ChildItem -Recurse -Filter *.java -Path "zapsdtest" | ForEach-Object { $_.FullName })

# --- Utility: compile helper -------------------------------------------------
function Compile-Sources {
    param (
        [string]$Label,
        [string[]]$Sources,
        [string]$ClassPath = "."
    )
    if (-not $Sources -or $Sources.Count -eq 0) {
        Write-Host "No sources found for $Label."
        return
    }
    Write-Host "Compiling $Label sources..."
    & $JavaC -cp $ClassPath @Sources
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Compilation failed for $Label."
        exit 1
    }
}

# --- Targets -----------------------------------------------------------------

function main {
    Compile-Sources "main" (@($MainSrc) + $APSDSrc) $CPath
    Write-Host "Run with: ./winbuild.ps1 run"
}

function run {
    main
    Write-Host "Executing Main..."
    & $JavaVM -cp $CPath "Main"
}

function test {
    Compile-Sources "test" ($APSDSrc + $TestSrc) $CPath
    Write-Host "Run tests with: ./winbuild.ps1 runtest"
}

function runtest {
    test
    Write-Host "Running JUnit tests..."
    & $JavaVM -jar $JUnitC execute --scan-class-path --details tree --class-path .
}

function runtestsimp {
    test
    Write-Host "Running JUnit SimpleTest tests..."
    & $JavaVM -jar $JUnitC execute --details tree --class-path . --select-package zapsdtest.simpletest
}

function runtestexer {
    test
    Write-Host "Running JUnit TestExer tests..."
    & $JavaVM -jar $JUnitC execute --details tree --class-path . --select-package zapsdtest.simpletest.apsd.classes.exercises
}

function runtestfull {
    test
    Write-Host "Running JUnit SimpleTest tests..."
    & $JavaVM -jar $JUnitC execute --details tree --class-path . --select-package zapsdtest.fulltest
}

function clean {
    Write-Host "Cleaning .class files..."
    Get-ChildItem -Recurse -Filter *.class | ForEach-Object {
        Remove-Item $_.FullName -Force
        Write-Host "Removed $($_.FullName)"
    }
}

function help {
    Write-Host "Usage: ./winbuild.ps1 [target]"
    Write-Host ""
    Write-Host "Targets:"
    Write-Host "  all          - Compile main sources (default)"
    Write-Host "  main         - Compile Main.java and apsd/"
    Write-Host "  run          - Execute Main class"
    Write-Host "  test         - Compile test sources"
    Write-Host "  runtest      - Execute JUnit tests"
    Write-Host "  runtestsimp  - Execute JUnit simple tests"
    Write-Host "  runtestexer  - Execute JUnit exer tests"
    Write-Host "  runtestfull  - Execute JUnit full tests"
    Write-Host "  clean        - Remove all .class files"
}

# --- Dispatcher --------------------------------------------------------------
switch ($Target.ToLower()) {
    "all"         { main }
    "main"        { main }
    "run"         { run }
    "test"        { test }
    "runtest"     { runtest }
		"runtestsimp" { runtestsimp }
		"runtestexer" { runtestexer }
		"runtestfull" { runtestfull }
    "clean"       { clean }
    "help"        { help }
    default       {
        Write-Host "Unknown target: $Target"
        help
        exit 1
    }
}
