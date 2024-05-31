#INFO: OLD VERSION OF SONARCLOUD ANALYSIS (GIT HASH: 116431d4111df8e501858039f9712bfbcf0f641c)
#WARN: THIS VERSION OF WORKFLOW IS WORKING BUT NOT HAVE ALL FEATURE NEED TO WORKING WITH SONARCLOUD ANALYSIS
name: SonarCloud C#
on:
    push:
        branches:
            - main
    pull_request:
        types: [opened, synchronize, reopened]
jobs:
    build:
        name: Build and analyze
        runs-on: windows-latest
        steps:
            - name: Set up JDK 17
              uses: actions/setup-java@v3
              with:
                  java-version: 17
                  distribution: "zulu"
            - uses: actions/checkout@v3
              with:
                  fetch-depth: 0
            - name: Cache SonarCloud packages
              uses: actions/cache@v3
              with:
                  path: ~\sonar\cache
                  key: ${{ runner.os }}-sonar
                  restore-keys: ${{ runner.os }}-sonar
            - name: Cache SonarCloud scanner
              id: cache-sonar-scanner
              uses: actions/cache@v3
              with:
                  path: .\.sonar\scanner
                  key: ${{ runner.os }}-sonar-scanner
                  restore-keys: ${{ runner.os }}-sonar-scanner
            - name: Install SonarCloud scanner
              if: steps.cache-sonar-scanner.outputs.cache-hit != 'true'
              shell: powershell
              run: |
                  New-Item -Path .\.sonar\scanner -ItemType Directory
                  dotnet tool update dotnet-sonarscanner --tool-path .\.sonar\scanner
            - name: Test and collect coverage
              shell: powershell
              run: |
                  dotnet tool install --global dotnet-reportgenerator-globaltool
                  dotnet test Backend/Backend.sln --no-build --logger "trx" /p:CollectCoverage=true /p:CoverletOutputFormat=cobertura /p:CoverletOutput=./TestResults/Coverage/
                  reportgenerator -reports:./TestResults/Coverage/*.cobertura.xml -targetdir:./TestResults/Coverage/Reports -reporttypes:"HtmlInline_AzurePipelines;Cobertura"
                  .\.sonar\scanner\dotnet-sonarscanner begin /k:"MaxRemyDev_ShowCalendar" /o:"maxremydev" /d:sonar.token="${{ secrets.SONAR_TOKEN }}" /d:sonar.host.url="https://sonarcloud.io" /d:sonar.cs.opencover.reportsPaths="./TestResults/Coverage/Reports/Cobertura.xml"
            - name: Build
              shell: powershell
              run: dotnet build Backend/Backend.sln
            - name: SonarCloud analysis
              shell: powershell
              run: |
                  .\.sonar\scanner\dotnet-sonarscanner end /d:sonar.token="${{ secrets.SONAR_TOKEN }}"

#INFO: RUNNER WORKFLOW TO LOCAL MACHINE WITH NEKTOS/ACT WITH DOCKER (WIP)
#WARN: THIS WORKFLOW IS SEMI-WORKING WITH ACT, THERE ARE BUGS WITH "BEGIN, TEST AND END SONARCLOUD ANALYSIS” STEPS
#INFO: BUT NO TESTING IN GITHUB ACTIONS HAS BEEN DONE
# name: SonarCloud
# on:
#   push:
#     branches:
#       - main
#   pull_request:
#     types: [opened, synchronize, reopened]

# jobs:
#   build_and_analyze:
#     name: Build and Analyze
#     runs-on: ubuntu-latest

#     steps:
#       - name: Set up JDK 17
#         uses: actions/setup-java@v3
#         with:
#           java-version: 17
#           distribution: 'zulu'

#       - uses: actions/checkout@v3
#         with:
#           fetch-depth: 0

#       - name: Install .NET SDK
#         run: |
#           wget https://dot.net/v1/dotnet-install.sh
#           chmod +x dotnet-install.sh
#           ./dotnet-install.sh --version 8.0.203
#           echo "$HOME/.dotnet" >> $GITHUB_PATH
#           echo "$HOME/.dotnet/tools" >> $GITHUB_PATH

#       - name: Define DOTNET_ROOT
#         run: |
#           echo "DOTNET_ROOT=$HOME/.dotnet" >> $GITHUB_ENV

#       - name: Install SonarCloud scanner
#         run: |
#           dotnet tool install --global dotnet-sonarscanner

#       - name: Verify SonarScanner Installation
#         run: |
#           dotnet tool list --global

#       - name: Begin SonarCloud analysis & Test and collect coverage & End SonarCloud analysis
#         env:
#           GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
#           SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
#         run: |
#           dotnet sonarscanner begin /d:sonar.login=$SONAR_TOKEN /k:"MaxRemyDev_ShowCalendar" /o:"maxremydev" /d:sonar.host.url="https://sonarcloud.io" /d:sonar.cs.opencover.reportsPaths="./TestResults/Coverage/Reports/Cobertura.xml" /d:sonar.verbose=true
#           dotnet build Backend/Backend.sln
#           dotnet tool install --global coverlet.console
#           coverlet ./Backend.Tests/bin/Debug/net8.0/Backend.Tests.dll --target "dotnet" --targetargs "test ./Backend/Backend.sln --no-build" --format cobertura
#           dotnet tool install --global dotnet-reportgenerator-globaltool
#           reportgenerator -reports:"./TestResults/Coverage/*.cobertura.xml" -targetdir:"./TestResults/Coverage/Reports" -reporttypes:"HtmlInline_AzurePipelines;Cobertura"
#           dotnet sonarscanner end /d:sonar.login=$SONAR_TOKEN
