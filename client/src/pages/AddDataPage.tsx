import { useEffect, useState, type FormEvent } from "react";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import Card from "../components/Card";
import { dataApi } from "../services/endpoints";
import { useAuth } from "../context/AuthContext";
import { setAuthToken } from "../services/api";

export default function AddDataPage() {
  const { token } = useAuth();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    item: "",
    prepared: "",
    sold: "",
    cost: "",
    date: dayjs().format("YYYY-MM-DD")
  });

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setSaving(true);
      await dataApi.addSale({
        item: form.item,
        prepared: Number(form.prepared),
        sold: Number(form.sold),
        cost: Number(form.cost),
        date: form.date
      });
      toast.success("Data saved successfully");
      setForm((prev) => ({ ...prev, item: "", prepared: "", sold: "", cost: "" }));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Could not save data");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl pb-24 md:pb-4">
      <Card title="Add Sales Data">
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            className="w-full rounded-xl border border-white/20 bg-transparent p-2"
            placeholder="Dish Name"
            value={form.item}
            onChange={(e) => setForm((prev) => ({ ...prev, item: e.target.value }))}
            required
          />
          <input
            className="w-full rounded-xl border border-white/20 bg-transparent p-2"
            placeholder="Prepared Quantity"
            type="number"
            value={form.prepared}
            onChange={(e) => setForm((prev) => ({ ...prev, prepared: e.target.value }))}
            required
            min={0}
          />
          <input
            className="w-full rounded-xl border border-white/20 bg-transparent p-2"
            placeholder="Sold Quantity"
            type="number"
            value={form.sold}
            onChange={(e) => setForm((prev) => ({ ...prev, sold: e.target.value }))}
            required
            min={0}
          />
          <input
            className="w-full rounded-xl border border-white/20 bg-transparent p-2"
            placeholder="Cost per item"
            type="number"
            value={form.cost}
            onChange={(e) => setForm((prev) => ({ ...prev, cost: e.target.value }))}
            required
            min={0}
            step="0.01"
          />
          <input
            className="w-full rounded-xl border border-white/20 bg-transparent p-2"
            type="date"
            value={form.date}
            onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
            required
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? "Saving..." : "Save Data"}
          </button>
        </form>
      </Card>
    </div>
  );
}
