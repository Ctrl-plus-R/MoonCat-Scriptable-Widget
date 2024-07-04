# MoonCat-Scriptable-Widget
IOS widget programmed with [Scriptable](https://scriptable.app/) that shows a different random MoonCat based on user-defined filters in each widget refresh loop

## General
You can have several widgets at once with different settings.
Each widget can show a specific cat, switch between a selection or even change randomly.
Wallets can also be specified to define the selection of cats. 
iOS takes care of updating the widgets independently.
You can also set a background for the widget.

## Requirements
- device with iOS
- installed [Scriptable app](https://scriptable.app/)
- [Moralis](https://moralis.io/) account with API key

## Setup
1. add mooncat-scriptable-widget.js to Scriptable app
   - either press the plus icon in the Scriptable app and copy+paste the code
   - or put the file into the Scriptable folder in your iCloud drive
3. add widget to your homescreen
   - long press
   - plus icon
   - search “Scriptable”
   - all sizes work, but small and large look best
3. click widget to reach the settings
   - choose mooncat-scriptable-widget as script
   - it probably doesn’t matter what to choose as interaction
   - add [config](#config) to parameter field

## Config
You must enter a configuration in the parameter field of your widget.
The config is a json string and therefore enclosed in curly brackets.
It consists of your Moralis API key and optional additional settings.

Don’t forget the quotation marks around keys and string values as shown in the [examples](#example-configurations).

### Optional Parameters
The following parameters can optionally be added to the config.

<a name="config-filter"></a>
|         | Filter                                                     |
| ------- | :--------------------------------------------------------- |
| Key     | `"filter"`                                                 |
| Type    | string                                                     |
| Values  | `"wallets"`, `"cats"` or (see [cat types](#cat-types))     |
| Default | rescued                                                    |
| Example | `"filter": "lunar"`                                        |
| Notes   | - `"wallets"` requires another parameter [`"wallets"`](#config-wallets) <br> - `"cats"` requires another parameter [`"cats"`](#config-cats) |

<a name="config-cats"></a>
|         | Cats                                                  |
| ------- | :---------------------------------------------------- |
| Key     | `"cats"`                                              |
| Type    | string (catId), number (rescueIndex) or array of both |
| Values  | catId or rescueIndex                                  |
| Example | `"cats": [392, "0x00d8523a53"]`                       |
| Note    | requires [`"filter": "specific"`](#config-filter)     |
  
<a name="config-wallets"></a>
|         | Wallets                                                                                |
| ------- | :------------------------------------------------------------------------------------- |
| Key     | `"wallets"`                                                                            |
| Type    | string or array of strings                                                             |
| Values  | walletId (40-digit hex string, e.g. `"0x..."`)                                                            |
| Example | `"wallets": "0x..."`                                                                   |
| Notes   | - requires [`"filter": "wallets"`](#config-filter) <br> - only finds acclimated cats |
  
<a name="config-background-color"></a>
|         | Background Color                         |
| ------- | :--------------------------------------- |
| Key     | `"background"`                           |
| Type    | string                                   |
| Values  | `"black"`, `"white"`, `"blue"`, `"brown"`, `"cyan"`, `"darkGray"`, `"gray"`, `"green"`, `"lightGray"`, `"magenta"`, `"orange"`, `"purple"`, `"red"`, `"yellow"` |
| Default | inverted glow color of the displayed cat |
| Example | `"background": "black"`                  |


<a name="config-background-image"></a>
|         | Background Image                                                                             |
| ------- | :------------------------------------------------------------------------------------------- |
| Key     | `"backgroundImage"`                                                                          |
| Type    | string                                                                                       |
| Values  | a valid link to a jpg or png                                                                 |
| Example | `"backgroundImage": "https://mooncat.community/img/bgstarssmall.png"`                        |
| Note    | image is downloaded each time the widget is updated, as cashing has not yet been implemented |

### Cat Types
This is the categorization of all cats as used in the config parameter [filter](#config-filter).

| Type             | Description             |
| :--------------- | :---------------------- |
| `"rescued"`      | minted, non-genesis     |
| `"lunar"`        | non-minted, non-genesis |
| `"genesis"`      | minted, genesis         |
| `"hero"`         | non-minted, genesis     |
| `"colored"`      | rescued + lunar         |
| `"colorless"`    | genesis + hero          |
| `"domesticated"` | rescued + genesis       |
| `"wild"`         | lunar + hero            |

### Example Configurations

#### Minimum
A minimum configuration looks like this (with your own API key):
```json
{
  "moralisApiKey": "YOUR_API_KEY"
}
```
This would show a random rescued cat in front of the cat’s inverted glow color.

#### Cats from multiple wallets
A longer configuration could look likes this (with actual wallet ids):
```json
{
  "moralisApiKey": "YOUR_API_KEY",
  "background": "black",
  "filter": "wallets",
  "wallets": ["0x...", "0x..."]
}
```
This would display a random cat from one of the two wallets against a black background, each cat with the same probability.

#### Specific cat
```json
{
  "moralisApiKey": "YOUR_API_KEY",
  "filter": "specific",
  "cat": 392
}
```
This would always show the same magnificent cat in front of its inverted glow color.
