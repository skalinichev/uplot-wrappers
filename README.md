# uPlot wrappers


A collection of [uPlot](https://github.com/leeoniya/uPlot "uPlot") wrappers that allows you to work with charts declaratively inside your favorite framework.

**Table of Contents**

- [Motivation](#motivation)
- [Getting started](#getting-started)
- [React](#react)
    - [Installation](#installation)
    - [How to use](#how-to-use)
    - [Demo](#demo)
- [Vue.js](#vuejs)
    - [Installation](#installation-1)
    - [How to use](#how-to-use-1)
    - [Demo](#demo-1)
- [Documentation](#documentation)

# Motivation

While several other uPlot wrappers already exist, all of them have one of the following limitations:
1. They create uPlot instance once, during component mount phase, and expect you to handle all the update logic yourself.
2. They recreate uPlot instance anew whenever the props change, even if the instance can be updated to reflect the changes.

In comparison this library tries it's best not to recreate the uPlot instance once the props change. Instead of recreation it tries to use uPlot public API to keep it up to date with the props.

# Getting started

See [React](#react) or [Vue.js](#vuejs) sections below depending on what framework you're using.
Also see API [documentation](#documentation) common to both frameworks.

# React
## Installation
Install uplot-react package with uplot dependency:
- Using npm: `$ npm install uplot-react uplot`
- Using yarn: `$ yarn add uplot-react uplot`

You also need React 16.8 or above to be installed inside your project tree.

## How to use
```javascript
import React from 'react';
import uPlot from 'uplot';
import UplotReact from 'uplot-react';
import 'uplot/dist/uPlot.min.css';

const Chart = () =>
    (<UplotReact
        options={options}
        data={data}
        target={target}
        onCreate={(chart) => {}}
        onDelete={(chart) => {}}
    />);
```
## Demo
To run the demo app locally clone this repository, then execute the following commands inside the project root directory:

`yarn install && yarn run serveReact`

# Vue.js

## Installation
Install uplot-vue package with uplot dependency:
- Using npm: `$ npm install uplot-vue uplot`
- Using yarn: `$ yarn add uplot-vue uplot`

You also need Vue.js 2.6 to be installed inside your project tree, Vue.js 3 is not supported yet.

## How to use
Using template
```html
<template>
    <UplotVue
        :data="data"
        :options="options"
        :target="target"
        @create="onCreate"
        @delete="onDelete"
    />
 </template>
 <script>
    import Vue from 'vue';
    import uPlot from 'uplot';
    import UplotVue from 'uplot-vue';
    import 'uplot/dist/uPlot.min.css';

    const Chart = Vue.extend({components: {uplotvue: UplotVue}});
 </script>
```
Using JSX
```javascript
import Vue from 'vue';
import uPlot from 'uplot';
import UplotVue from 'uplot-vue';
import 'uplot/dist/uPlot.min.css';

const Chart = Vue.extend({
    render(h) {
        return (
            <UplotVue
                options={options}
                data={data}
                target={target}
                onDelete={(chart) => {}}
                onCreate={(chart) => {}}
            />
        );
    }
});
```
## Demo
To run the demo app locally clone this repository, then execute the following commands inside the project root directory:

`yarn install && yarn run serveVue`

# Documentation
| Parameter | Requirement | Description |
|:-----:|:--:|:----------------------------|
| options  |required|Options for uPlot. Passed as the first argument to uPlot constructor: `new uPlot(options)`|
| data  |required|Data for uPlot. Passed as the second argument to uPlot constructor: `new uPlot(options, data)` |
| target  |optional|Target html element or init function for uPlot. Passed as the third argument to uPlot constructor: `new uPlot(options, data, target)` A new div target element will be created automatically if none is passed in the props|
| onCreate  |optional|Callback function, invoked upon uPlot instance creation or recreation|
| onDelete  |optional|Callback function, invoked before uPlot instance gets destroyed, either because the props has changed so much it's impossible to update the chart or because the component is about to be unmounted|
