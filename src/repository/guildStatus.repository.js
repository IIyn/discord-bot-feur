import { serverSetting } from "../config/mongo.config.js";

// Function to get server setting
export async function getServerSetting(guildId) {
  let setting = await serverSetting.findOne({ guildId });
  if (!setting) {
    setting = new serverSetting({ guildId, isStarted: true });
    await setting.save();
  }
  return setting.isStarted;
}

// Function to update server setting
export async function updateServerSetting(guildId, isStarted) {
  await serverSetting.findOneAndUpdate(
    { guildId },
    { isStarted },
    { upsert: true, new: true }
  );
}
