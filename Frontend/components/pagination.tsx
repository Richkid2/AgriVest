"use client";

import Button from "./cta-button";

function Pagination() {
  return (
    <div className="space-x-2.5">
      <Button variant="secondary" cta={() => {}} style="px-4 py-2">
        previous
      </Button>

      <Button cta={() => {}} style="px-4 py-2">
        next
      </Button>
    </div>
  );
}

export default Pagination;
