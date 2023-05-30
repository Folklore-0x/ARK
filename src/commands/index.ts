import { Composer } from 'grammy'

import qa from './qa'

const composer = new Composer()

composer.on('message').command('qa', qa)

export default composer
