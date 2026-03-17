function getId(val: unknown): number | null {
  if (typeof val === "number") return val;
  if (val && typeof val === "object" && "id" in val && typeof (val as { id: unknown }).id === "number") {
    return (val as { id: number }).id;
  }
  return null;
}

function normalizeMediaId(input: unknown): number | null {
  if (!input) return null;
  // 允许 { id } 或数字，或 relations 的 connect 结构
  const direct = getId(input);
  if (direct) return direct;

  if (input && typeof input === "object" && "connect" in input) {
    const connect = (input as { connect?: unknown }).connect;
    if (Array.isArray(connect) && connect.length > 0) {
      return getId(connect[0]);
    }
  }
  return null;
}

function assertExclusiveMedia(data: Record<string, unknown>) {
  const imageId = normalizeMediaId(data.image);
  const videoId = normalizeMediaId(data.video);
  if (imageId && videoId) {
    throw new Error("首页封面：图片与视频不能同时上传，请二选一。");
  }
}

export default {
  beforeCreate(event: unknown) {
    const data = (event as { params?: { data?: Record<string, unknown> } }).params?.data;
    if (data) assertExclusiveMedia(data);
  },
  beforeUpdate(event: unknown) {
    const data = (event as { params?: { data?: Record<string, unknown> } }).params?.data;
    if (data) assertExclusiveMedia(data);
  },
};

