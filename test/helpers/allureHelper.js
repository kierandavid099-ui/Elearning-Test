import AllureReporter from '@wdio/allure-reporter'

export const addFeature = (name) => AllureReporter.addFeature(name)
export const addSeverity = (level) => AllureReporter.addSeverity(level)
export const addStory = (name) => AllureReporter.addStory(name)
