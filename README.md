# Wikisearch

Wikisearch is a CLI tool that you can use to quickly search summaries of anything on Wikipedia. It got some useful features like quickly copying summaries and opening it in the browser using.

## Installation

##### You must have `nodejs` and `npm` installed.

```
npm install -g wikisearch
```

You can verify the installation by using `wikisearch -h`

## Usage

### Fetching summaries

```
wikisearch -s <search_word>
```
Example:
```
wikisearch -s Javascript
```

#### Opening in browsers: `-b`

```
wikisearch -s Javascript -b
```
#### Copying summaries: `-c`
`-b` and `-c` can be used together.
```
wikisearch -s Javascript -c
```

### Fetching related pages

```
wikisearch -s <search_word> -r
```

### Debugging
There are 2 debugging levels: 1-2\
1: Shows the arguments passed when doing a search.\
2: Same as 1, but shows the entire response in json format.\
To see debugging info, use `-d<level>` after any search.

Example:
```
wikisearch -s JavaScript -d1
```

## Community

You can join my discord [server](https://discord.gg/Hhrje9sF4g) if you want to contact me.
