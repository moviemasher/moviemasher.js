import { JobArgs, JobOptions } from "./Job"
import { JobClass } from "./JobClass"

const jobFactoryInstance = (options: JobOptions) => {
  return new JobClass(jobFactoryArgs(options))
}
const jobFactoryArgs = (options: JobOptions): JobArgs => {
  return {
    id: '', definitions: [],
    ...options
  }
}

const JobFactory = {
  instance: jobFactoryInstance,
  args: jobFactoryArgs,
}

export { JobFactory, jobFactoryInstance, jobFactoryArgs }
