import { JobOptions } from "./Job"
import { JobClass } from "./JobClass"

const jobFactoryInstance = (options: JobOptions) => {
  return new JobClass(options)
}

const JobFactory = {
  instance: jobFactoryInstance
}

export { JobFactory }
