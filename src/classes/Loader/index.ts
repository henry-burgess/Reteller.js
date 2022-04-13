/**
 * @summary Utility class to examine the JSON contents prior to running
 * the replay functionality
 */
export class Loader {
  /**
   * Default constructor for 'Loader' class
   * @param {CaptureData} _data JSON collection of records to examine
   * @return {boolean}
   * @class
   */
  static examine(_data: CaptureData): boolean {
    return true;
  }
}
