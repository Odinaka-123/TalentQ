import { notFound } from "next/navigation";
import Image from "next/image";
import { getCandidateDetail } from "@/lib/queries/candidate-detail";
import CandidateActionsWrapper from "./components/CandidateActionsWrapper";

export default async function CandidateDetailPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = await params;
  const candidate = await getCandidateDetail(applicationId);

  if (!candidate) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-start gap-4">
        {candidate.avatarUrl ?
          <Image
            src={candidate.avatarUrl}
            alt={candidate.name}
            width={72}
            height={72}
            className="rounded-full object-cover"
          />
        : <div className="flex h-18 w-18 items-center justify-center rounded-full bg-muted text-lg font-medium">
            {candidate.name.charAt(0)}
          </div>
        }
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">{candidate.name}</h1>
            {candidate.identityVerified && (
              <span className="text-xs text-green-600">Verified</span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{candidate.headline}</p>
          {candidate.overallRating !== null && (
            <p className="mt-1 text-sm">
              ⭐ {candidate.overallRating.toFixed(1)} (
              {candidate.reviews.length} review
              {candidate.reviews.length === 1 ? "" : "s"})
            </p>
          )}
        </div>
        {candidate.aiScore !== null && (
          <div className="text-right">
            <p className="text-xs text-muted-foreground">AI Match</p>
            <p className="text-lg font-semibold">{candidate.aiScore}%</p>
          </div>
        )}
      </div>

      <div className="mt-6">
        <CandidateActionsWrapper candidate={candidate} />
      </div>

      {candidate.skills.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-2 text-sm font-medium">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {candidate.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border px-3 py-1 text-xs"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {candidate.portfolio.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-2 text-sm font-medium">Portfolio</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {candidate.portfolio.map((item) => (
              <div key={item.id} className="overflow-hidden rounded-lg border">
                {item.image_url && (
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    width={200}
                    height={140}
                    className="h-32 w-full object-cover"
                  />
                )}
                <div className="p-2">
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  {item.tags && item.tags.length > 0 && (
                    <p className="truncate text-xs text-muted-foreground">
                      {item.tags.join(", ")}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {candidate.reviews.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-2 text-sm font-medium">Reviews</h2>
          <div className="space-y-4">
            {candidate.reviews.map((review) => (
              <div key={review.id} className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{review.employerName}</p>
                  <p className="text-sm">⭐ {review.rating}</p>
                </div>
                {review.comment && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {review.comment}
                  </p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
